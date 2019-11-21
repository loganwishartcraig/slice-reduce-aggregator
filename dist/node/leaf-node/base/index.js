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
var index_1 = require("../../index");
var LeafNode = /** @class */ (function (_super) {
    __extends(LeafNode, _super);
    function LeafNode(config) {
        var _this = _super.call(this, config) || this;
        _this._children = _this._initChildren();
        return _this;
    }
    LeafNode.prototype._getId = function (item) {
        return this._idAccessor(item);
    };
    LeafNode.prototype.hasChild = function (key) {
        return false;
    };
    LeafNode.prototype.getChildByKey = function () {
        return undefined;
    };
    LeafNode.prototype.getAllChildren = function () {
        return [];
    };
    LeafNode.prototype.getItemChildren = function () {
        return [];
    };
    return LeafNode;
}(index_1.default));
exports.default = LeafNode;
//# sourceMappingURL=index.js.map