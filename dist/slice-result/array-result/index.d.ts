import SliceResult from "..";
export default class ArrayResult<T> extends SliceResult<T, 'array'> {
    private _seenIds;
    protected _initResultsContainer(): T[];
    add(item: T): void;
    remove(item: T): void;
}
