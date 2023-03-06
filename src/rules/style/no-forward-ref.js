const nestModule = require('../../entities/nest-module');

module.exports = {
  'no-forward-ref': {
    meta: {
      type: 'suggestion',
      docs: {
        description:
          "Don't use forwardRef, because it smells like circular dependencies.",
        recommended: false,
      },
    },
    create: function (context) {
      return {
        ClassDeclaration: function (node) {
          const moduleDecorator = nestModule.getModuleDecorator(node);
          if (!moduleDecorator) {
            return;
          }
          const properties = moduleDecorator.expression.arguments[0].properties;
          if (!properties) {
            return;
          }

          const importsProperty = properties.find(
            (property) => property.key.name === 'imports'
          );
          const imports = importsProperty?.value.elements ?? [];

          imports.forEach((imported) => {
            if (
              imported.type === 'CallExpression' &&
              imported.callee.name === 'forwardRef'
            ) {
              context.report({
                message: "Don't use `forwardRef`",
                node: imported,
              });
            }
          });
        },
      };
    },
  },
};
