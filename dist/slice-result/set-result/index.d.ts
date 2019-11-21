import SliceResult from "..";
export default class SetResult<T> extends SliceResult<T, 'set'> {
    protected _initResultsContainer(): Set<T>;
    add(item: T): void;
    remove(item: T): void;
}
