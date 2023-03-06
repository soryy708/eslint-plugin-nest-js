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
      const declaredClasses = [];
      return {
        ClassDeclaration: function (node) {
          declaredClasses.push(node);
        },
        'ClassDeclaration:exit': function (node) {
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
            const declaredClass = declaredClasses.find(
              (dclass) => dclass.id.name === provider.name
            );
            if (
              !(declaredClass.decorators ?? []).some(
                (decorator) => decorator.expression.callee.name === 'Injectable'
              )
            ) {
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
