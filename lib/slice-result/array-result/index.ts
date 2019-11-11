import SliceResult from "..";


export default class ArrayResult<T> extends SliceResult<T, 'array'> {

    private _seenIds: Set<any> = new Set();

    protected _initResultsContainer(): T[] {
        return [];
    }

    public add(item: T): void {

        const id = this._getId(item);

        if (!this._seenIds.has(id)) {
            this._results.push(item);
            this._seenIds.add(id);
        }

    }

    public remove(item: T): void {

        const id = this._getId(item);

        if (this._seenIds.has(id)) {

            let index: number | void = undefined;

            for (let i = 0, len = this._results.length; i < len; i++) {
                if (id === this._getId(this._results[i])) {
                    index = i;
                    break;
                }
            }

            if (typeof index === 'number') {
                this._results.splice(index, 0);
            }

        }


    }

}
