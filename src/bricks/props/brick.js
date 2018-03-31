import Brick from '../baseBrick';
import PropsRenderer from './renderer';
import { ast, CodeOperation, Commit, j } from '../../utils';

class PropsBrick extends Brick {
  static initialState = {
    props: [],
    hasPropTypesImport: false,
    hasPropTypes: false,
    hasDefaultProps: false,
    hasStaticPropTypes: false,
    hasStaticDefaultProps: false,
    isFlowCompiler: false,
    flowPropsName: 'Props',
  };

  constructor(id) {
    super(id);
    this.name = 'Props';
    this.renderer = PropsRenderer;
    this.state = { ...PropsBrick.initialState };
  }

  evaluate = (/*code, tree, store*/) => {
    let state = {
      ...PropsBrick.initialState,
      isFlowCompiler: this.isFlowCompiler(),
    };

    const parsed = this.parsed;

    this.findPropTypesImport(parsed, state);
    this.findPropTypes(parsed, state);
    this.findDefaultProps(parsed, state);

    this.setState(state);
  };

  /**
   * Indicate whether the current project compiler is set to Flow
   *
   * @return {bool}
   */
  isFlowCompiler = () => {
    const isFirstLineFlowComment =
      this.code && this.code.split('\n')[0].includes('@flow');
    const isFlowCompiler = this.store.project.compiler === 'flow';
    return isFirstLineFlowComment || isFlowCompiler;
  };

  /**
   * Given an AST, find if 'prop-types' is being imported
   *
   * @param {object} parsed
   * @param {State} currentState
   */
  findPropTypesImport = (parsed, currentState) => {
    parsed
      .find(j.ImportDeclaration)
      .filter(
        ({ node }) =>
          ast.isDefaultImport(node) && ast.isImportFrom(node, 'prop-types')
      )
      .forEach(() => {
        currentState.hasPropTypesImport = true;
      });
  };

  /**
   * Given an AST, find any prop types definition
   *
   * @param {object} parsed
   * @param {State} currentState
   */
  findPropTypes = (parsed, currentState) => {
    let hasPropTypes = false;

    if (currentState.isFlowCompiler) {
      // IDEA: different way of finding out .flowPropsName
      // class .. extends Component<Props, State> => ClassDeclaration.superTypeParameters
      //   -> .params.each(param).id.name|.type === 'Identifier'

      // type Props
      parsed
        .find(j.TypeAlias)
        .filter(path => path.value.id.name.includes('Props'))
        .forEach(path => {
          hasPropTypes = true;
          currentState.flowPropsName = path.value.id.name;
          this.crawlProperties(
            'propTypes',
            path.value.right.properties,
            currentState
          );
        });
    } else {
      // Component.propTypes
      parsed
        .find(j.ExpressionStatement, {
          expression: {
            operator: '=',
            left: {
              property: { name: 'propTypes' },
            },
          },
        })
        .forEach(path => {
          hasPropTypes = true;
          this.crawlProperties(
            'propTypes',
            path.value.expression.right.properties,
            currentState
          );
        });

      // static propTypes
      parsed
        .find(j.ClassProperty, {
          static: true,
          key: { name: 'propTypes' },
        })
        .forEach(path => {
          hasPropTypes = true;
          currentState.hasStaticPropTypes = true;
          this.crawlProperties(
            'propTypes',
            path.value.value.properties,
            currentState
          );
        });
    }

    currentState.hasPropTypes = hasPropTypes;
  };

  /**
   * Given an AST, find any default props definition
   *
   * @param {object} parsed
   * @param {State} currentState
   */
  findDefaultProps = (parsed, currentState) => {
    let hasDefaultProps = false;

    // Component.defaultProps
    parsed
      .find(j.ExpressionStatement, {
        expression: {
          operator: '=',
          left: {
            property: { name: 'defaultProps' },
          },
        },
      })
      .forEach(path => {
        hasDefaultProps = true;
        this.crawlProperties(
          'defaultProps',
          path.value.expression.right.properties,
          currentState
        );
      });

    // static defaultProps
    parsed
      .find(j.ClassProperty, {
        static: true,
        key: { name: 'defaultProps' },
      })
      .forEach(path => {
        hasDefaultProps = true;
        currentState.hasStaticDefaultProps = true;
        this.crawlProperties(
          'defaultProps',
          path.value.value.properties,
          currentState
        );
      });

    currentState.hasDefaultProps = hasDefaultProps;
  };

  /**
   * Given an object properties' set, update current React props.
   *
   * @param {string} target enum {'propTypes', 'defaultProps'}
   * @param {object} properties
   * @param {State} state
   */
  crawlProperties = (target, properties, state) => {
    for (const property of properties) {
      const { name: propName } = property.key;

      let type;
      let isRequired;
      let newProp = {};
      newProp.name = propName;

      if (target === 'propTypes') {
        if (state.isFlowCompiler) {
          // Flow
          isRequired = !property.optional;
          type = ast.flow.normalizeType(property.value.type);
          newProp.flowValueNode = property.value;
          // TODO: below line could be removed
          newProp.flowType = property.value.type;
        } else if (
          property.value.object &&
          (property.value.object.name === 'PropTypes' ||
            (property.value.object.object &&
              property.value.object.object.name === 'PropTypes'))
        ) {
          // Babel
          if (property.value.property.name === 'isRequired') {
            type = property.value.object.property.name;
            isRequired = true;
          } else {
            type = property.value.property.name;
            isRequired = false;
          }
        }

        newProp.type = type;
        newProp.isRequired = isRequired;
      } else if (target === 'defaultProps') {
        newProp.default = property.value;
      }

      const index = this.findIndexAmongProps(state.props, propName);

      if (index === -1) {
        state.props.push(newProp);
      } else {
        state.props[index] = { ...state.props[index], ...newProp };
      }
    }
  };

  printDefaultProps = () => {
    const { props } = this.state;
    const propertyId = j.identifier('defaultProps');
    let propsObject = [];

    for (const prop of Object.values(props)) {
      if (prop.default && !prop.isRequired) {
        const property = j.objectProperty(
          j.identifier(prop.name),
          prop.default
        );
        propsObject.push(property);
      }
    }

    return j.classProperty(
      propertyId,
      j.objectExpression(propsObject),
      null,
      true
    );
  };

  printPropTypes = () => {
    const { isFlowCompiler, props } = this.state;
    const propertyId = j.identifier('propTypes');
    let propsObject = [];

    if (isFlowCompiler) {
      // Flow
      let typeDeclaration = `type ${this.state.flowPropsName} = {\n`;

      for (const prop of Object.values(props)) {
        typeDeclaration +=
          '  ' +
          prop.name +
          (!prop.isRequired ? '?' : '') +
          ': ' +
          prop.type +
          ',\n';
      }

      typeDeclaration += '};';

      return j.template.statement([typeDeclaration]);
    } else {
      // Babel
      for (const prop of Object.values(props)) {
        let memberExpression;

        if (prop.isRequired) {
          memberExpression = j.memberExpression(
            j.memberExpression(
              j.identifier('PropTypes'),
              j.identifier(prop.type)
            ),
            j.identifier('isRequired')
          );
        } else {
          memberExpression = j.memberExpression(
            j.identifier('PropTypes'),
            j.identifier(prop.type)
          );
        }

        const property = j.objectProperty(
          j.identifier(prop.name),
          memberExpression
        );
        propsObject.push(property);
      }

      return j.classProperty(
        propertyId,
        j.objectExpression(propsObject),
        null,
        true
      );
    }
  };

  findIndexAmongProps = (props, propName) =>
    props.findIndex(prop => prop.name === propName);

  updateProp = (propName, property, newValue) => {
    let props = this.state.props;
    const index = this.findIndexAmongProps(props, propName);

    if (index !== -1) {
      props[index] = { ...props[index], [property]: newValue };
      this.setState({ props });
    }
  };

  removeProp = propName => {
    let props = this.state.props;
    const index = this.findIndexAmongProps(props, propName);

    if (index !== -1) {
      props.splice(index, 1);
      this.setState({ props });
    }
  };

  updateCode = () => {
    const stateHasProps = this.state.props.length > 0;
    const stateHasDefaultProps =
      this.state.props.filter(prop => !prop.isRequired).length > 0;
    const findTypeAlias = [
      j.TypeAlias,
      { id: { name: this.state.flowPropsName } },
    ];
    const findStaticPropTypes = [
      j.ClassProperty,
      { key: { name: 'propTypes' } },
    ];
    const findStaticDefaultProps = [
      j.ClassProperty,
      { key: { name: 'defaultProps' } },
    ];

    const {
      isFlowCompiler,
      hasPropTypes,
      hasDefaultProps,
      // hasStaticDefaultProps,
      // hasStaticPropTypes,
    } = this.state;

    let updatePropTypes;
    let updateDefaultProps;

    if (hasPropTypes) {
      if (stateHasProps) {
        if (isFlowCompiler) {
          // Replace flow prop types
          updatePropTypes = CodeOperation.findAndReplace(
            ...findTypeAlias,
            this.printPropTypes()
          );
        } else {
          // Replace static prop types
          updatePropTypes = CodeOperation.findAndReplace(
            ...findStaticPropTypes,
            this.printPropTypes()
          );
        }
      } else {
        if (isFlowCompiler) {
          // Remove flow prop types
          updatePropTypes = CodeOperation.findAndRemove(...findTypeAlias);
        } else {
          // Remove static prop types
          updatePropTypes = CodeOperation.findAndRemove(...findStaticPropTypes);
        }
      }
    } else {
      if (stateHasProps) {
        if (isFlowCompiler) {
          // TODO
          // Create flow prop types
        } else {
          // Create static prop types
          updatePropTypes = new CodeOperation(parsed => {
            return parsed.find(j.ClassBody).forEach(path => {
              const bodyNodes = ast.sortClassBodyNodes([
                this.printPropTypes(),
                ...path.value.body,
              ]);
              const classbody = j.classBody(bodyNodes);
              return path.replace(classbody);
            });
          });
        }
      }
    }

    if (hasDefaultProps) {
      if (stateHasDefaultProps) {
        // Replace static default props
        updateDefaultProps = CodeOperation.findAndReplace(
          ...findStaticDefaultProps,
          this.printDefaultProps()
        );
      } else {
        // Remove static default props
        updateDefaultProps = CodeOperation.findAndRemove(
          ...findStaticDefaultProps
        );
      }
    } else {
      if (stateHasDefaultProps) {
        // Create static default props
        updateDefaultProps = new CodeOperation(parsed => {
          return parsed.find(j.ClassBody).forEach(path => {
            const bodyNodes = ast.sortClassBodyNodes([
              this.printDefaultProps(),
              ...path.value.body,
            ]);
            const classbody = j.classBody(bodyNodes);
            return path.replace(classbody);
          });
        });
      }
    }

    const commit = new Commit();

    if (updatePropTypes) {
      commit.addCodeOperation(updatePropTypes);
    }

    if (updateDefaultProps) {
      commit.addCodeOperation(updateDefaultProps);
    }

    // TODO: Props for typescript
    // const test = new CodeOperation((parsed) => {
    //   console.log(parsed
    //     .find(j.InterfaceDeclaration, { id: { name: 'Props' }}).size());
    //   return parsed
    //     .find(j.InterfaceDeclaration, { id: { name: 'Props' }}).remove();
    // });
    // commit.addCodeOperation(test);

    commit.run();
  };

  brickWillUpdate() {
    this.updateCode();
  }

  importPropTypes = () => {
    const importPackage = CodeOperation.importModule(
      { defaultIdentifier: 'PropTypes' },
      'prop-types'
    );

    new Commit(importPackage).run();
  };

  addEmptyProp = () => {
    const props = this.state.props;

    const newProp = {
      name: 'newProp',
      default: j.literal('default'),
      type: 'string',
      isRequired: false,
    };

    props.push(newProp);

    this.setState({ props });
  };
}

export default PropsBrick;
