"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var array_result_1 = require("../slice-result/array-result");
var map_result_1 = require("../slice-result/map-result");
var set_result_1 = require("../slice-result/set-result");
var SliceResultFactory = /** @class */ (function () {
    function SliceResultFactory() {
    }
    SliceResultFactory.build = function (tree) {
        var config = {
            idAccessor: tree.getIdAccessor()
        };
        switch (tree.getContainerType()) {
            case 'array':
                return new array_result_1.default(config);
            case 'map':
                return new map_result_1.default(config);
            case 'set':
                return new set_result_1.default(config);
            default:
                throw new Error("Unknown slice result container type " + tree.getContainerType());
        }
    };
    return SliceResultFactory;
}());
exports.default = SliceResultFactory;
//# sourceMappingURL=index.js.map