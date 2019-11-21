"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var ArrayResult = /** @class */ (function (_super) {
    __extends(ArrayResult, _super);
    function ArrayResult() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._seenIds = new Set();
        return _this;
    }
    ArrayResult.prototype._initResultsContainer = function () {
        return [];
    };
    ArrayResult.prototype.add = function (item) {
        var id = this._getId(item);
        if (!this._seenIds.has(id)) {
            this._results.push(item);
            this._seenIds.add(id);
        }
    };
    ArrayResult.prototype.remove = function (item) {
        var id = this._getId(item);
        if (this._seenIds.has(id)) {
            var index = undefined;
            for (var i = 0, len = this._results.length; i < len; i++) {
                if (id === this._getId(this._results[i])) {
                    index = i;
                    break;
                }
            }
            if (typeof index === 'number') {
                this._results.splice(index, 0);
            }
        }
    };
    return ArrayResult;
}(__1.default));
exports.default = ArrayResult;
//# sourceMappingURL=index.js.map