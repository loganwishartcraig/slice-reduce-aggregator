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
var SetResult = /** @class */ (function (_super) {
    __extends(SetResult, _super);
    function SetResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SetResult.prototype._initResultsContainer = function () {
        return new Set();
    };
    SetResult.prototype.add = function (item) {
        this._results.add(item);
    };
    SetResult.prototype.remove = function (item) {
        this._results.delete(this._getId(item));
    };
    return SetResult;
}(__1.default));
exports.default = SetResult;
//# sourceMappingURL=index.js.map