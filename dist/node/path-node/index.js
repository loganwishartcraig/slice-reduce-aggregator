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
var utils_1 = require("../../utils");
var node_factory_1 = require("../../node-factory");
var PathNode = /** @class */ (function (_super) {
    __extends(PathNode, _super);
    function PathNode(config) {
        var _this = _super.call(this, config) || this;
        _this._children = {};
        _this._aggregator = config.aggregator;
        _this._nextAggregators = config.nextAggregators;
        return _this;
    }
    PathNode.prototype.add = function (item) {
        var _this = this;
        this._getItemChildrenKeys(item).forEach(function (key) {
            if (!_this._hasChildNode(key)) {
                _this._setChildNode(key, _this._initChildNode(key));
            }
            _this._getChildNode(key).add(item);
        });
    };
    ;
    PathNode.prototype.remove = function (item, options) {
        var subTrees = options.useExhaustiveSearch ? this.getAllChildren() : this.getItemChildren(item);
        subTrees.forEach(function (_a) {
            var _ = _a[0], tree = _a[1];
            return tree.remove(item, options);
        });
    };
    ;
    PathNode.prototype.purge = function () {
        this._children = {};
    };
    ;
    PathNode.prototype.size = function () {
        return Object.values(this._children).reduce(function (sum, child) { return sum + child.size(); }, 0);
    };
    ;
    PathNode.prototype.leaves = function () {
        return Object
            .values(this._children)
            .reduce(function (leaves, node) { return leaves.concat(node.leaves()); }, []);
    };
    PathNode.prototype.hasChild = function (key) {
        return this._hasChildNode(key);
    };
    PathNode.prototype.getChildByKey = function (key) {
        return this._getChildNode(key);
    };
    PathNode.prototype.getAllChildren = function () {
        return Object.entries(this._children);
    };
    PathNode.prototype.getItemChildren = function (item) {
        var _this = this;
        return this._getItemChildrenKeys(item).reduce(function (children, key) {
            if (_this._hasChildNode(key)) {
                children.push([key, _this._getChildNode(key)]);
            }
            return children;
        }, []);
    };
    PathNode.prototype._initChildNode = function (key) {
        return node_factory_1.default.build({
            key: key,
            aggregators: this._nextAggregators,
            containerType: this._containerType,
            idAccessor: this._idAccessor,
            parent: this
        });
    };
    PathNode.prototype._hasChildNode = function (key) {
        return this._children.hasOwnProperty(key);
    };
    PathNode.prototype._setChildNode = function (key, node) {
        this._children[key] = node;
    };
    PathNode.prototype._getChildNode = function (key) {
        return this._children[key];
    };
    PathNode.prototype._getItemChildrenKeys = function (item) {
        return utils_1.Utils.resolveItemKey(item, this._aggregator);
    };
    return PathNode;
}(__1.default));
exports.default = PathNode;
//# sourceMappingURL=index.js.map