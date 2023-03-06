const nestModule = require('../../entities/nest-module');

module.exports = {
  'no-multi-export': {
    meta: {
      type: 'suggestion',
      docs: {
        description:
          "Don't export more than one provider, because it violates the Interface Segregation Principle.",
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

          const exportsProperty = properties.find(
            (property) => property.key.name === 'exports'
          );
          const exporteds = exportsProperty?.value.elements ?? [];

          if (exporteds.length > 1) {
            context.report({
              message: "Don't export more than one provider",
              node: exportsProperty,
            });
          }
        },
      };
    },
  },
};
