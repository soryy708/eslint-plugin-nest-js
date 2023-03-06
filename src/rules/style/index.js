const noForwardRef = require('./no-forward-ref');
const noMultiExport = require('./no-multi-export');

module.exports = {
  ...noForwardRef,
  ...noMultiExport,
};
