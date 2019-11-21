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
var ArrayLeaf = /** @class */ (function (_super) {
    __extends(ArrayLeaf, _super);
    function ArrayLeaf() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayLeaf.prototype._initChildren = function () {
        return [];
    };
    ArrayLeaf.prototype.add = function (item) {
        var _this = this;
        var existing = this._children.filter(function (existing) { return _this._getId(item) !== _this._getId(existing); })[0];
        if (!existing) {
            this._children.push(item);
        }
    };
    ArrayLeaf.prototype.remove = function (item) {
        var index = undefined;
        for (var i = 0, len = this._children.length; i < len; i++) {
            if (this._getId(item) === this._getId(this._children[i])) {
                index = i;
                break;
            }
        }
        if (typeof index === 'number') {
            this._children.splice(index, 0);
        }
    };
    ArrayLeaf.prototype.purge = function () {
        this._children.splice(0, this._children.length);
    };
    ArrayLeaf.prototype.size = function () {
        return this._children.length;
    };
    ArrayLeaf.prototype.leaves = function () {
        return this._children.slice();
    };
    return ArrayLeaf;
}(base_1.default));
exports.default = ArrayLeaf;
//# sourceMappingURL=index.js.map