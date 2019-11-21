"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ALL"] = 0] = "ALL";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["LOG"] = 3] = "LOG";
    LogLevel[LogLevel["WARN"] = 4] = "WARN";
    LogLevel[LogLevel["ERROR"] = 5] = "ERROR";
    LogLevel[LogLevel["NONE"] = 6] = "NONE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var Logger = /** @class */ (function () {
    function Logger(logLevel) {
        if (logLevel === void 0) { logLevel = LogLevel.WARN; }
        this._moduleName = 'SubsetTree';
        this._logLevel = logLevel;
    }
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._shouldLog(LogLevel.DEBUG)) {
            this._log.apply(this, __spreadArrays([console.debug], args));
        }
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._shouldLog(LogLevel.INFO)) {
            this._log.apply(this, __spreadArrays([console.info], args));
        }
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._shouldLog(LogLevel.LOG)) {
            this._log.apply(this, __spreadArrays([console.log], args));
        }
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._shouldLog(LogLevel.WARN)) {
            this._log.apply(this, __spreadArrays([console.warn], args));
        }
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._shouldLog(LogLevel.ERROR)) {
            this._log.apply(this, __spreadArrays([console.error], args));
        }
    };
    Logger.prototype.setLogLevel = function (logLevel) {
        this._logLevel = logLevel;
    };
    Logger.prototype._log = function (logger) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        logger.apply(void 0, __spreadArrays(["[" + this._moduleName + "] - "], args));
    };
    Logger.prototype._shouldLog = function (logLevel) {
        return this._logLevel >= logLevel;
    };
    return Logger;
}());
exports.Logger = Logger;
exports._globalLogger = new Logger();
//# sourceMappingURL=logger.js.map