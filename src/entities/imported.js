const { ESLintUtils } = require('@typescript-eslint/utils');
const parser = require('@typescript-eslint/parser');

function isImport(node) {
  return node.type === 'ImportSpecifier';
}

module.exports = {
  /**
   * ESLint provides us with each file's AST in isolation.
   * If we need more information about the imported token, we'll need to
   * parse the imported file's AST for the declaration.
   * @param node AST node containing the import
   * @returns AST node which declares the imported token. If `node` isn't an import, returns it as-is.
   */
  resolveImportedDeclaration: (node, context) => {
    if (!isImport(node)) {
      return node;
    }

    const parserServices = ESLintUtils.getParserServices(context);
    const typeChecker = parserServices.program.getTypeChecker();
    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
    const type = typeChecker.getTypeAtLocation(tsNode);
    const symbol = type.getSymbol();
    const { fileName, text } = symbol.parent.valueDeclaration;
    const parsed = parser.parse(text, {
      ...context.parserOptions,
      filePath: fileName,
    });
    const resolved = parsed.body
      .filter((n) => n.type === 'ExportNamedDeclaration')
      .map((n) => n.declaration)
      .find((d) => d?.id.name === symbol.escapedName);
    return resolved;
  },
};
