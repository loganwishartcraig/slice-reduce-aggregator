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
var MapLeaf = /** @class */ (function (_super) {
    __extends(MapLeaf, _super);
    function MapLeaf() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapLeaf.prototype._initChildren = function () {
        return new Map();
    };
    MapLeaf.prototype.add = function (item) {
        var id = this._getId(item);
        if (!this._children.has(id)) {
            this._children.set(id, item);
        }
    };
    MapLeaf.prototype.remove = function (item) {
        var id = this._getId(item);
        this._children.delete(id);
    };
    MapLeaf.prototype.purge = function () {
        this._children.clear();
    };
    MapLeaf.prototype.size = function () {
        return this._children.size;
    };
    MapLeaf.prototype.leaves = function () {
        return Array.from(this._children.values());
    };
    return MapLeaf;
}(base_1.default));
exports.default = MapLeaf;
//# sourceMappingURL=index.js.map