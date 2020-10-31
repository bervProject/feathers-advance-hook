"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("@feathersjs/errors");
var defaultCreatedColumn = 'createdBy';
var defaultUpdatedColumn = 'updatedBy';
var defaultDeletedColumn = 'deletedBy';
var defaultUserProperty = 'email';
exports.default = (function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.createdColumn, createdColumn = _c === void 0 ? defaultCreatedColumn : _c, _d = _b.updatedColumn, updatedColumn = _d === void 0 ? defaultUpdatedColumn : _d, _e = _b.deletedColumn, deletedColumn = _e === void 0 ? defaultDeletedColumn : _e, _f = _b.userProperty, userProperty = _f === void 0 ? defaultUserProperty : _f;
    return function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var app, data, method, service, type, params, disableSoftDelete, result, paramUser, user, userModifier, paramColumn, paramColumn, paramColumn, updatedData, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = context.app, data = context.data, method = context.method, service = context.service, type = context.type, params = context.params;
                    disableSoftDelete = params.disableSoftDelete;
                    if (app.version < '4.0.0') {
                        throw new errors_1.GeneralError('The userAuditHook hook requires Feathers 4.0.0 or later');
                    }
                    if (type === 'after') {
                        // only valid use in before hooks
                        return [2 /*return*/, context];
                    }
                    if (method !== 'create' && method !== 'update' && method !== 'patch' && method !== 'remove') {
                        return [2 /*return*/, context];
                    }
                    result = {};
                    paramUser = userProperty;
                    user = params.user;
                    userModifier = 'SYSTEM';
                    if (user && user[paramUser]) {
                        userModifier = user[paramUser];
                    }
                    if (!(method === 'create')) return [3 /*break*/, 1];
                    paramColumn = createdColumn;
                    result[paramColumn] = userModifier;
                    return [3 /*break*/, 4];
                case 1:
                    if (!(method === 'update' || method === 'patch')) return [3 /*break*/, 2];
                    paramColumn = updatedColumn;
                    result[paramColumn] = userModifier;
                    return [3 /*break*/, 4];
                case 2:
                    if (!(method === 'remove' && !disableSoftDelete)) return [3 /*break*/, 4];
                    paramColumn = deletedColumn;
                    result[paramColumn] = userModifier;
                    updatedData = Object.assign(data, result);
                    id = context.id || null;
                    return [4 /*yield*/, service.patch(id, updatedData, params)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    context.data = Object.assign(data, result);
                    return [2 /*return*/, context];
            }
        });
    }); };
});
