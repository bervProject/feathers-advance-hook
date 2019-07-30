const userAuditHook = require('./common/user-audit-hook');
const uploadHook = require('./common/upload-hook');

const moduleExports = {
  userAuditHook,
  uploadHook
};

module.exports = moduleExports;
module.exports.default = moduleExports;