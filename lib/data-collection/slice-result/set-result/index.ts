import SliceResult from "..";

export default class SetResult<T> extends SliceResult<T, 'set'> {

    protected _initResultsContainer(): Set<T> {
        return new Set();
    }

    public add(item: T): void {
        this._results.add(item);
    }

    public remove(item: T): void {
        this._results.delete(this._getId(item));
    }

}
