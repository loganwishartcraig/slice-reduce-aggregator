import SliceResult from "..";
export default class MapResult<T> extends SliceResult<T, 'map'> {
    protected _initResultsContainer(): Map<any, T>;
    add(item: T): void;
    remove(item: T): void;
}
