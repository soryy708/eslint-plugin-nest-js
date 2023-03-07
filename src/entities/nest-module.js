module.exports = {
  getModuleDecorator: (node) =>
    node?.decorators?.find(
      (decorator) => decorator.expression.callee.name === 'Module'
    ),
};
