"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SliceResult = /** @class */ (function () {
    function SliceResult(_a) {
        var idAccessor = _a.idAccessor;
        this._results = this._initResultsContainer();
        this._idAccessor = idAccessor;
    }
    SliceResult.prototype.results = function () {
        return this._results;
    };
    SliceResult.prototype._getId = function (item) {
        return this._idAccessor(item);
    };
    return SliceResult;
}());
exports.default = SliceResult;
//# sourceMappingURL=index.js.map