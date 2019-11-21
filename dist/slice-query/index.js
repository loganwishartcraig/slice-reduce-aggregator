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
var constants_1 = require("../constants");
var slice_result_factory_1 = require("../slice-result-factory");
;
var TreeQuery = /** @class */ (function () {
    function TreeQuery(config, tree) {
        this._executed = false;
        this._query = config;
        this._tree = tree;
        this.id = config.id;
        this._result = this._initResults();
    }
    TreeQuery.prototype._resolveNextBFSNodes = function (_a) {
        var currentNode = _a.currentNode, _b = _a.condition, _c = _b === void 0 ? ['any'] : _b, operator = _c[0], value = _c[1], currentAggregationKey = _a.currentAggregationKey;
        switch (operator) {
            case 'eq':
                return [currentNode.getChildByKey(value)]
                    .filter(function (item) { return !!item; });
            case 'in':
                return value
                    .map(function (key) { return currentNode.getChildByKey(key); })
                    .filter(function (item) { return !!item; });
            case 'ne':
                return currentNode
                    .getAllChildren()
                    .filter(function (_a) {
                    var key = _a[0], _node = _a[1];
                    return key !== value;
                })
                    .map(function (_a) {
                    var _key = _a[0], node = _a[1];
                    return node;
                });
            case 'out':
                return currentNode
                    .getAllChildren()
                    .filter(function (_a) {
                    var key = _a[0], _node = _a[1];
                    return !value.includes(key);
                })
                    .map(function (_a) {
                    var _key = _a[0], node = _a[1];
                    return node;
                });
            case 'any':
                return currentNode
                    .getAllChildren()
                    .map(function (_a) {
                    var _key = _a[0], node = _a[1];
                    return node;
                });
            case 'null':
                return [currentNode.getChildByKey(constants_1.VoidKey)]
                    .filter(function (item) { return !!item; });
            default:
                console.error("Unknown slice operator " + operator + " for aggregation " + currentAggregationKey);
                return [];
        }
    };
    TreeQuery.prototype.append = function (item) {
        var conditions = this._query.conditions;
        var aggKeys = this._tree.getAggregationOrder();
        var keyPath = this._tree.getItemKeyPaths(item);
        for (var i = 0, len = aggKeys.length; i < len; i++) {
            var aggName = aggKeys[i];
            var keys = keyPath[i];
            var meetsCriteria = false;
            // Try every key value returned to see if any
            // of them match the current level's query criteria
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                meetsCriteria = this._keyMatchesConditionValue(key, conditions[aggName], aggName);
                // Break early if we know we found a match.
                if (meetsCriteria) {
                    break;
                }
            }
            // If no key value matched the current criteria,
            // we know not to add it to the query result.
            if (!meetsCriteria) {
                return this._result;
            }
        }
        this._result.add(item);
        return this._result;
    };
    TreeQuery.prototype._keyMatchesConditionValue = function (key, _a, aggName) {
        var _b = _a === void 0 ? ['any'] : _a, operator = _b[0], value = _b[1];
        switch (operator) {
            case 'eq':
                return key === value;
            case 'ne':
                return key !== value;
            case 'in':
                return value.includes(key);
            case 'out':
                return !value.includes(key);
            case 'any':
                return true;
            case 'null':
                return key === constants_1.VoidKey;
            default:
                console.error("Unknown condition operator " + operator + " in query for " + aggName);
                return false;
        }
    };
    TreeQuery.prototype.remove = function (item) {
        this._result.remove(item);
        return this._result;
    };
    return TreeQuery;
}());
exports.TreeQuery = TreeQuery;
var SliceQuery = /** @class */ (function (_super) {
    __extends(SliceQuery, _super);
    function SliceQuery() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SliceQuery.prototype._initResults = function () {
        return slice_result_factory_1.default.build(this._tree);
    };
    SliceQuery.prototype.exec = function () {
        var _this = this;
        if (this._executed)
            return this._result;
        var conditions = this._query.conditions;
        var recurse = function (currentNode, _a) {
            var _b = _a === void 0 ? [] : _a, currentAggregationKey = _b[0], remainingAggregationKeys = _b.slice(1);
            if (!currentNode) {
                return;
            }
            if (!currentAggregationKey) {
                return currentNode.leaves().forEach(function (item) { return _this._result.add(item); });
            }
            var condition = conditions[currentAggregationKey] || ['any', true];
            _this._resolveNextBFSNodes({ currentNode: currentNode, condition: condition, currentAggregationKey: currentAggregationKey })
                .forEach(function (nextNode) { return recurse(nextNode, remainingAggregationKeys); });
        };
        recurse(this._tree.getRoot(), this._tree.getAggregationOrder());
        this._executed = true;
        return this._result;
    };
    return SliceQuery;
}(TreeQuery));
exports.default = SliceQuery;
//# sourceMappingURL=index.js.map