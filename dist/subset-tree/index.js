"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_factory_1 = require("../node-factory");
var slice_query_1 = require("../slice-query");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var SubsetTree = /** @class */ (function () {
    function SubsetTree(config) {
        this._cachedQueries = {};
        this._nextQueryId = 0;
        this._containerType = config.containerType;
        this._aggregators = config.aggregators;
        this._idAccessor = config.idAccessor;
        this._aggregationOrder = config.aggregators.map(function (_a) {
            var name = _a.name;
            return name;
        });
        this._root = this._initRootNode();
    }
    SubsetTree.prototype._initRootNode = function () {
        return node_factory_1.default.build({
            aggregators: this._aggregators,
            containerType: this._containerType,
            key: constants_1.RootKey,
            idAccessor: this._idAccessor,
            parent: undefined
        });
    };
    SubsetTree.prototype.add = function (item) {
        this._root.add(item);
        Object.values(this._cachedQueries).forEach(function (query) { return query.append(item); });
    };
    SubsetTree.prototype.remove = function (item, options) {
        if (options === void 0) { options = {
            useExhaustiveSearch: false
        }; }
        this._root.remove(item, options);
        Object.values(this._cachedQueries).forEach(function (query) { return query.remove(item); });
    };
    SubsetTree.prototype.purge = function () {
        this._root.purge();
        this._cachedQueries = {};
    };
    SubsetTree.prototype.freeCachedQueries = function () {
        this._cachedQueries = {};
    };
    SubsetTree.prototype.getCachedQuery = function (id) {
        return this._cachedQueries[id];
    };
    SubsetTree.prototype.size = function () {
        return this._root.size();
    };
    SubsetTree.prototype.getRoot = function () {
        return this._root;
    };
    SubsetTree.prototype.getContainerType = function () {
        return this._containerType;
    };
    SubsetTree.prototype.getIdAccessor = function () {
        return this._idAccessor;
    };
    SubsetTree.prototype.getAggregationOrder = function () {
        return __spreadArrays(this._aggregationOrder);
    };
    SubsetTree.prototype.slice = function (config) {
        var query = new slice_query_1.default(__assign(__assign({}, config), { id: this._nextQueryId++ }), this);
        if (config.cache) {
            // Need to be careful about managing cached queries.
            // It could cause a memory leak cache is never freed.
            this._cachedQueries[query.id] = query;
        }
        return query.exec();
    };
    SubsetTree.prototype.getItemKeyPaths = function (item) {
        return this._aggregators.map(function (agg) { return utils_1.Utils.resolveItemKey(item, agg); });
    };
    return SubsetTree;
}());
exports.default = SubsetTree;
//# sourceMappingURL=index.js.map