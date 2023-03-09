module.exports = {
  isInjectable: (node) => {
    const isClass = node?.type === 'ClassDeclaration';
    const hasInjectableDecorator = (node?.decorators ?? []).some(
      (decorator) => decorator.expression.callee.name === 'Injectable'
    );
    return node && isClass && hasInjectableDecorator;
  },
};
