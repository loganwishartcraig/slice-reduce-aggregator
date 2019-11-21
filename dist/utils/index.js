"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
exports.Utils = {
    isValidKey: function (key) {
        return typeof key === 'string' || key === undefined || key === null;
    },
    resolveKey: function (key) {
        return (typeof key === 'string') ? key : constants_1.VoidKey;
    },
    resolveItemKey: function (item, _a) {
        var keyAccessor = _a.keyAccessor;
        var key = keyAccessor(item);
        var keyList = Array.isArray(key) ? key : [key];
        var validKeys = Object.keys(keyList.reduce(function (seenKeys, currentKey) {
            if (exports.Utils.isValidKey(currentKey)) {
                var actualKey = exports.Utils.resolveKey(currentKey);
                if (!seenKeys[actualKey]) {
                    seenKeys[actualKey] = true;
                }
            }
            return seenKeys;
        }, {}));
        return validKeys.length ? validKeys : [constants_1.VoidKey];
    }
};
//# sourceMappingURL=index.js.map