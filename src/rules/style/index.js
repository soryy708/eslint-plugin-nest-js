const noForwardRef = require('./no-forward-ref');
const noMultiExport = require('./no-multi-export');
const maxProviders = require('./max-providers');

module.exports = {
  ...maxProviders,
  ...noForwardRef,
  ...noMultiExport,
};
