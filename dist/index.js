"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var upload_hook_1 = require("./common/upload-hook");
var user_audit_hook_1 = require("./common/user-audit-hook");
var moduleExports = {
    uploadHook: upload_hook_1.default,
    userAuditHook: user_audit_hook_1.default,
};
exports.default = moduleExports;
