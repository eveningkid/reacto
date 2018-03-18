import Brick from '../baseBrick';
import ComponentTypeRenderer from './renderer';
import { ast, CodeOperation, Commit, j } from '../../utils';

class ComponentTypeBrick extends Brick {
  static componentTypes = {
    class: 'class',
    variable: 'variable',
    function: 'function',
  };

  constructor() {
    super();
    this.name = 'Component Type';
    this.renderer = ComponentTypeRenderer;
    this.state = {
      components: [],
    };
  }

  /**
   * Main callback
   * Called every time code has changed
   */
  evaluate = (code, parsed, store) => {
    this.parseCode();
  }

  /**
   * Handy method to update the brick's state
   */
  parseCode = (parsed) => {
    const components = this.findComponents();
    this.setState({ components });
  }

  /**
   * Find all components from the current file
   */
  findComponents = () => {
    const parsed = this.parsed;
    const { fromVariable, fromFunction, fromClass } = ast.findReactComponents(parsed);

    let components = [];

    for (const component of fromVariable) {
      components.push({
        type: ComponentTypeBrick.componentTypes.variable,
        name: component.node.declarations[0].id.name,
        node: component,
      });
    }

    for (const component of fromFunction) {
      components.push({
        type: ComponentTypeBrick.componentTypes.function,
        name: component.node.id.name,
        node: component,
      });
    }

    for (const component of fromClass) {
      components.push({
        type: ComponentTypeBrick.componentTypes.class,
        name: component.node.id.name,
        node: component,
      });
    }

    return components;
  }

  /**
   * Renderer method
   * Try to transform a composite component to pure component
   *
   * @param {string} componentName
   */
  transformToPureComponent = (componentName) => {
    const component = this.findComponentByName(componentName);

    if (component.type === 'class') {
      const operation = new CodeOperation(parsed => {
        return parsed
          .find(j.ClassDeclaration, { id: { name: component.name } })
          .replaceWith(path => {
            const methods = j(path.node.body).find(j.ClassMethod);

            // TODO check for this.state calls
            if (
              methods.size() === 1
              && methods.get().node.key.name === 'render'
            ) {
              const functionBody = methods.get().node;
              const functionNode = j.template.statement`function ${componentName}(props) { ${functionBody.body.body} }`;

              j(functionNode)
                .find(j.MemberExpression, { object: { type: 'ThisExpression' }, property: { name: 'props' } })
                .replaceWith(path => j.identifier('props'));

              return functionNode;
            } else {
              return path.node;
            }
          });
      });

      new Commit(operation).run();
    } else {
      return;
    }
  }

  /**
   * Renderer method
   * Try to transform a pure component to composite
   *
   * @param {string} componentName
   */
  transformToComposite = (componentName) => {
    const component = this.findComponentByName(componentName);
    let componentNode = component.node;
    let operation;

    if (component.type === 'function') {
      // Replace "props" with "this.props"
      j(componentNode)
        .find(j.Identifier, { name: 'props' })
        .replaceWith(path => j.memberExpression(j.thisExpression(), j.identifier('props')));

      const classBody = j.template.statement`class ${componentName} extends React.Component {
  render() { ${componentNode.value.body.body} }
}`;

      operation = new CodeOperation(parsed => {
        return parsed
          .find(j.FunctionDeclaration, { id: { name: component.name } })
          .replaceWith(classBody);
      });
    } else if (component.type === 'variable') {
      // From @jhgg
      // https://github.com/jhgg/js-transforms/blob/master/pure-to-composite-component.js
      operation = new CodeOperation(parsed => {
        return parsed
          .find(j.VariableDeclaration)
          .filter(path => {
            return (
              path.value.declarations.length === 1
              && path.value.declarations[0].id.name === component.name
            );
          })
          .replaceWith(path => {
            const decl = path.value.declarations[0];

            if (
              decl.init.type !== 'ArrowFunctionExpression'
              || (!j(decl.init.body).find(j.JSXElement).size() > 0 && decl.init.body.type !== 'JSXElement')
            ) {
              return path.value;
            }

            let body = decl.init.body;
            body = body.type === 'JSXElement' ? j.returnStatement(body) : body = body.body;

            j(body)
              .find(j.Identifier, {name: 'props'})
              .replaceWith(p => j.memberExpression(j.thisExpression(), j.identifier('props')));

            return j.template.statement`class ${componentName} extends React.Component {
  render() { ${body} }
}`;
          });
      });
    } else {
      return;
    }

    new Commit(operation).run();
  }

  /**
   * Helper
   *
   * @param {string} name
   */
  findComponentByName = (name) => this.state.components.find(component => component.name === name);
}

export default ComponentTypeBrick;
