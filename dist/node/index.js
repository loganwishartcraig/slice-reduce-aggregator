"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_factory_1 = require("../node-factory");
var Node = /** @class */ (function () {
    function Node(_a) {
        var key = _a.key, parent = _a.parent, containerType = _a.containerType, idAccessor = _a.idAccessor;
        if (typeof key !== 'string') {
            throw new TypeError("A Node sub-class was instantiated with a non-string 'key'. All nodes must be instantiated with a string key. Empty strings are permitted. Received: " + key);
        }
        else if (!node_factory_1.default.isValidContainerType(containerType)) {
            throw new TypeError("A Node sub-class was instantiated with an invalid 'containerType'. Valid container types are " + node_factory_1.default.validContainerTypes.join(', ') + ". Received: " + containerType);
        }
        else if (typeof idAccessor !== 'function') {
            throw new TypeError("A Node sub-class was instantiated with a non-function 'idAccessor'. All 'idAccessors' should be of the signature (item: T) => string | void | (string | void)[]. Received: " + idAccessor);
        }
        else if (parent && !(parent instanceof Node)) {
            throw new TypeError("A Node sub-class was instantiated with a non-null, non-Node 'parent'. All node parent's must be undefined, or extend the abstract Node class. Received " + parent);
        }
        this.key = key;
        this.parent = parent;
        this._containerType = containerType;
        this._idAccessor = idAccessor;
    }
    return Node;
}());
exports.default = Node;
//# sourceMappingURL=index.js.map