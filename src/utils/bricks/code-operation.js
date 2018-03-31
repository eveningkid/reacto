import { j, ast } from '..';

/**
 * Represent any code operation given a current code state.
 * Contain the operation to apply to code when given to a Commit instance.
 */
class CodeOperation {
  /**
   * @param {function} callback (parsed) => return parsed...
   *                            Code transformation using a function
   */
  constructor(callback) {
    this.code = '';
    this.callback = callback;
  }

  static importModule(
    { defaultIdentifier, namespaceIdentifier, identifier, identifiers, node },
    moduleName = ''
  ) {
    const callback = parsed => {
      let imports = [];

      if (defaultIdentifier) {
        const id = j.importDefaultSpecifier(j.identifier(defaultIdentifier));
        imports.push(id);
      }

      if (namespaceIdentifier) {
        const id = j.importNamespaceSpecifier(
          j.identifier(namespaceIdentifier)
        );
        imports.push(id);
      }

      if (identifier || identifiers) {
        if (identifier) {
          identifiers = [identifier];
        }

        for (const importName of identifiers) {
          const id = j.importSpecifier(j.identifier(importName));
          imports.push(id);
        }
      }

      const imported = j.importDeclaration(imports, j.literal(moduleName));
      const parsedToDeclarations = parsed.find(j.ImportDeclaration);

      if (parsedToDeclarations.size() === 0) {
        // No imports, add it at the file's very beginning
        return parsed.find(j.Program).forEach(path => {
          path.node.body.unshift(node || imported);
          return path;
        });
      } else {
        return parsedToDeclarations.at(-1).insertBefore(node || imported);
      }
    };

    return new CodeOperation(callback);
  }

  static findAndReplace(type, filter, node) {
    const callback = parsed => {
      return parsed
        .find(type, filter)
        .replaceWith(path => ast.withComments(node, path.node));
    };

    return new CodeOperation(callback);
  }

  static findAndRemove(type, filter) {
    const callback = parsed => parsed.find(type, filter).remove();
    return new CodeOperation(callback);
  }

  using(code) {
    this.code = code;
    return this;
  }

  compute() {
    const parsed = j(this.code);
    // TODO use user's preferences
    return this.callback(parsed).toSource({
      quote: 'single',
      trailingComma: true,
    });
  }
}

export default CodeOperation;
