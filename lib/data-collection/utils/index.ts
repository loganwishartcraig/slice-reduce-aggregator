import { IAggregator } from "../types";
import { VoidKey } from "../constants";

export const Utils = {

    isValidKey: (key: any): boolean => {
        return typeof key === 'string' || key === undefined || key === null
    },

    resolveKey: (key: string | void) => {
        return (typeof key === 'string') ? key : VoidKey;
    },

    resolveItemKey: <T>(item: T, { keyAccessor }: IAggregator<T>): string[] => {

        const key = keyAccessor(item);
        const keyList = Array.isArray(key) ? key : [key];

        const validKeys = Object.keys(keyList.reduce((seenKeys, currentKey) => {

            if (Utils.isValidKey(currentKey)) {

                const actualKey = Utils.resolveKey(currentKey);

                if (!seenKeys[actualKey]) {
                    seenKeys[actualKey] = true;
                }

            }

            return seenKeys;

        }, {}));

        return validKeys.length ? validKeys : [VoidKey];

    }

}
