const nestInjectable = require('../../entities/nest-injectable');
const nestModule = require('../../entities/nest-module');
const imported = require('../../entities/imported');

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

          imports.forEach((imp) => {
            const declaration = context.getScope().upper.set.get(imp.name)
              ?.defs[0]?.node;
            const importedNode = imported.resolveImportedDeclaration(
              declaration,
              context
            );

            if (importedNode && nestInjectable.isInjectable(importedNode)) {
              context.report({
                message: 'Imported is an `@Injectable`',
                node: imp,
              });
            }
          });
        },
      };
    },
  },
};
