import { IAggregator } from "../types";
export declare const Utils: {
    isValidKey: (key: any) => boolean;
    resolveKey: (key: string | void) => string;
    resolveItemKey: <T>(item: T, { keyAccessor }: IAggregator<T>) => string[];
};
