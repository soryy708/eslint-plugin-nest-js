const nestModule = require('../../entities/nest-module');

module.exports = {
  'max-providers': {
    meta: {
      type: 'suggestion',
      docs: {
        description:
          "Don't give a module many providers, because it smells like a god object, which violates the Single Responsibility Principle.",
        recommended: false,
      },
      schema: [
        {
          type: 'integer',
          minimum: 1,
        },
      ],
      messages: {
        exceed:
          '{{name}} has too many providers ({{count}}). Maximum allowed is {{max}}.',
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

          const maximum = context.options[0];

          const providersProperty = properties.find(
            (property) => property.key.name === 'providers'
          );
          const providers = providersProperty?.value.elements ?? [];
          if (providers.length > maximum) {
            context.report({
              messageId: 'exceed',
              node: providersProperty,
              data: {
                name: node.id.name,
                count: providers.length,
                max: maximum,
              },
            });
          }
        },
      };
    },
  },
};
