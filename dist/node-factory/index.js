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
Object.defineProperty(exports, "__esModule", { value: true });
var leaf_node_1 = require("../node/leaf-node");
var path_node_1 = require("../node/path-node");
var NodeFactory = /** @class */ (function () {
    function NodeFactory() {
    }
    NodeFactory.build = function (_a) {
        var _b = _a.aggregators, _c = _b === void 0 ? [] : _b, currentAggregator = _c[0], nextAggregators = _c.slice(1), idAccessor = _a.idAccessor, containerType = _a.containerType, key = _a.key, parent = _a.parent;
        var config = {
            key: key,
            parent: parent,
            containerType: containerType,
            idAccessor: idAccessor
        };
        if (!currentAggregator) {
            switch (containerType) {
                case 'array':
                    return new leaf_node_1.ArrayLeaf(config);
                case 'map':
                    return new leaf_node_1.MapLeaf(config);
                case 'set':
                    return new leaf_node_1.SetLeaf(config);
                default:
                    throw new TypeError("Unknown container type " + containerType + ". Cannot create leaf node.");
            }
        }
        else {
            return new path_node_1.default(__assign(__assign({}, config), { aggregator: currentAggregator, nextAggregators: nextAggregators }));
        }
    };
    NodeFactory.isValidContainerType = function (type) {
        return this.validContainerTypes.includes(type);
    };
    NodeFactory.validContainerTypes = [
        'array',
        'map',
        'set'
    ];
    return NodeFactory;
}());
exports.default = NodeFactory;
//# sourceMappingURL=index.js.map