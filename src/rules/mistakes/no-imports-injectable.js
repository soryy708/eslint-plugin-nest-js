const nestModule = require('../../entities/nest-module');

module.exports = {
  'no-imports-injectable': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Classes given `@Module`s in their `imports` array must not be `@Injectable`s.',
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

          const importsProperty = properties.find(
            (property) => property.key.name === 'imports'
          );
          const imports = importsProperty?.value.elements ?? [];

          imports.forEach((imported) => {
            const declaredClass = declaredClasses.find(
              (dclass) => dclass.id.name === imported.name
            );
            if (
              (declaredClass.decorators ?? []).some(
                (decorator) => decorator.expression.callee.name === 'Injectable'
              )
            ) {
              context.report({
                message: 'Imported is an `@Injectable`',
                node: imported,
              });
            }
          });
        },
      };
    },
  },
};
