const nestInjectable = require('../../entities/nest-injectable');
const nestModule = require('../../entities/nest-module');

module.exports = {
  'injectable-providers': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Classes given `@Module`s in their `providers` array must be decorated with `@Injectable`.',
        recommended: true,
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

          const providersProperty = properties.find(
            (property) => property.key.name === 'providers'
          );
          const providers = providersProperty?.value.elements ?? [];

          providers.forEach((provider) => {
            const providerNode = context.getScope().upper.set.get(provider.name)
              ?.defs[0]?.node;
            if (providerNode && !nestInjectable.isInjectable(providerNode)) {
              context.report({
                message: 'Provider is not `@Injectable`',
                node: provider,
              });
            }
          });
        },
      };
    },
  },
};
