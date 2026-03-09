"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
};
exports.pick = pick;
//# sourceMappingURL=pick.js.map