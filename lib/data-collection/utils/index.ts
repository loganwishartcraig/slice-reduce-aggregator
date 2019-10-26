import { IAggregator } from "../types";
import { VoidKey } from "../constants";

export const Utils = {

    resolveItemKey: <T>(item: T, { keyAccessor }: IAggregator<T>): string[] => {

        const key = keyAccessor(item);

        if (typeof key === 'string') {
            return [key];
        } else if (key === undefined || key === null) {
            return [VoidKey];
        } else if (Array.isArray(key)) {
            return key
        } else {
            return [];
        }

    }

}
