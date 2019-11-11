import SliceResult from "..";


export default class MapResult<T> extends SliceResult<T, 'map'> {

    protected _initResultsContainer(): Map<any, T> {
        return new Map();
    }

    public add(item: T): void {
        this._results.set(this._getId(item), item);
    }

    public remove(item: T): void {
        this._results.delete(this._getId(item));
    }

}
