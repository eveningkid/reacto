import { j } from '..';
import { default as flow } from './flow';

/**
 * Is `node` an import? `import .. from ..`
 */
function isImport(node) {
  return node.type === 'ImportDeclaration';
}

/**
 * Is `node` an import declaration from the given external `moduleName`
 */
function isImportFrom(node, moduleName) {
  return node.source && node.source.value === moduleName;
}

/**
 * Is `node` a default import?
 */
function isDefaultImport(node) {
  return (
    node.specifiers &&
    Array.isArray(node.specifiers) &&
    node.specifiers.length === 1 &&
    node.specifiers[0].type === 'ImportDefaultSpecifier'
  );
}

/**
 * Does the import contain `specifierName` inside its `specifiers`?
 * e.g import { Hello, World } from '...';
 *     ast.hasImportSpecifier(node, 'Hello') => true
 */
function hasImportSpecifier(node, specifierName) {
  const { specifiers } = node;

  if (!specifiers) {
    return false;
  }

  for (const specifier of specifiers) {
    if (specifier.imported.name === specifierName) {
      return true;
    }
  }

  return false;
}

/**
 * Is `node` a class?
 */
function isClass(node) {
  return node.type === 'ClassDeclaration';
}

/**
 * Is `class(node)` a `React.Component`?
 */
function isClassComponent(node) {
  return (
    node.superClass &&
    ((node.superClass.name && node.superClass.name === 'Component') ||
      (node.superClass.object &&
        node.superClass.object.name === 'React' &&
        node.superClass.property &&
        node.superClass.property.name === 'Component'))
  );
}

/**
 * Does `node` have a boooody? ~o~
 */
function hasBody(node) {
  return node.body && !isNaN(node.body.start) && !isNaN(node.body.end);
}

/**
 * @see {@link https://github.com/reactjs/react-codemod/blob/master/transforms/manual-bind-to-arrow.js#L33}
 */
function withComments(to, from) {
  to.comments = from.comments;
  return to;
}

/**
 * @see {@link https://github.com/reactjs/react-codemod/blob/master/transforms/manual-bind-to-arrow.js#L38}
 */
function createArrowFunctionExpression(fn) {
  var arrowFunc = j.arrowFunctionExpression(fn.params, fn.body, false);

  arrowFunc.returnType = fn.returnType;
  arrowFunc.defaults = fn.defaults;
  arrowFunc.rest = fn.rest;
  arrowFunc.async = fn.async;

  return arrowFunc;
}

/**
 * Handy way to get a constructor object.
 * Do NOT reproduce this at home.
 * I warned you.
 */
function createComponentConstructor(body) {
  return j.template.statement([
    `class A {
    constructor(props) {
      super(props);
      ${body}
    }\n
  }`,
  ]).body.body[0];
}

/**
 * Is `node` a `super` call?
 * e.g `node` represents the following statement `super(props)` => true
 */
function isSuperCall(node) {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression' &&
    // babylon parser
    (node.expression.callee.type === 'Super' ||
      // flow parser
      (node.expression.callee.type === 'Identifier' &&
        node.expression.callee.name === 'super'))
  );
}

/**
 * Useful for the following function. Check below this one.
 */
function nodesComparer(a, b) {
  if (a.static && a.type === 'ClassProperty' && b.kind === 'constructor') {
    return -1;
  } else if (
    b.static &&
    b.type === 'ClassProperty' &&
    a.kind === 'constructor'
  ) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * Aim to sort nodes in a given order:
 * - 1st: static class properties
 * - 2nd: constructor
 * - 3rd: methods
 * IDEA could this be improved using the following?
 * https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
 *
 * @param {Array[Node]} nodes
 * @return {Array[Node]}
 */
function sortClassBodyNodes(nodes) {
  return nodes.sort(nodesComparer);
}

/**
 * In a given `ast`, find a class if any was found.
 * Useful if you quickly need a class information.
 */
function findClass(ast) {
  const findNode = j(ast).find(j.ClassDeclaration);
  if (findNode.length) {
    return findNode.get().node;
  } else {
    return {};
  }
}

/**
 * Return a class node's name.
 */
function classIdentifier(classNode = {}) {
  return classNode.id && classNode.id.name;
}

/**
 * Will find any React component (class, function, variable) given an AST.
 */
function findReactComponents(ast) {
  let paths = {
    fromFunction: [],
    fromVariable: [],
    fromClass: [],
  };

  // class ... extends React.*
  // class ... extends Component
  ast
    .find(j.ClassDeclaration)
    .filter(
      path =>
        path.node.superClass &&
        (path.node.superClass.name === 'Component' ||
          (path.node.superClass.object &&
            path.node.superClass.object.name === 'React'))
    )
    .forEach(path => paths.fromClass.push(path));

  // const ... = (props) => JSX
  ast
    .find(j.VariableDeclaration)
    .filter(
      path =>
        j(path)
          .findJSXElements()
          .size() > 0
    )
    .forEach(path => paths.fromVariable.push(path));

  // function ...(props) { return JSX }
  ast
    .find(j.FunctionDeclaration)
    .filter(
      path =>
        j(path)
          .findJSXElements()
          .size() > 0
    )
    .forEach(path => paths.fromFunction.push(path));

  return paths;
}

export default {
  // Helpers
  classIdentifier,
  hasBody,
  hasImportSpecifier,
  isDefaultImport,
  isImport,
  isImportFrom,
  isClass,
  isClassComponent,
  isSuperCall,
  findClass,

  // Externals
  flow,

  // Helpers that return a list of nodes
  findReactComponents,

  // Misc. helpers
  withComments,

  // Sort functions
  sortClassBodyNodes,

  // Factories
  createComponentConstructor,
  createArrowFunctionExpression,
};
