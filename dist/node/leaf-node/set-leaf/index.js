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
var base_1 = require("../base");
var SetLeaf = /** @class */ (function (_super) {
    __extends(SetLeaf, _super);
    function SetLeaf() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SetLeaf.prototype._initChildren = function () {
        return new Set();
    };
    SetLeaf.prototype.add = function (item) {
        this._children.add(item);
    };
    SetLeaf.prototype.remove = function (item) {
        this._children.delete(item);
    };
    SetLeaf.prototype.purge = function () {
        this._children.clear();
    };
    SetLeaf.prototype.size = function () {
        return this._children.size;
    };
    SetLeaf.prototype.leaves = function () {
        return Array.from(this._children.values());
    };
    return SetLeaf;
}(base_1.default));
exports.default = SetLeaf;
//# sourceMappingURL=index.js.map