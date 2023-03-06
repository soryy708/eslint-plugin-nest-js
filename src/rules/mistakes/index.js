const injectableProviders = require('./injectable-providers');
const noImportsInjectable = require('./no-imports-injectable');

module.exports = {
  ...injectableProviders,
  ...noImportsInjectable,
};
