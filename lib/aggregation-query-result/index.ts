import { IAggregatorSliceQueryConfig, IAggregatorSliceResult } from "../types";

export interface IAggregationQueryResult<T> {

    /**
     * Exposes the results of the query
     */
    results(): IAggregatorSliceResult<T>[];

    /**
     * Allows the results of separate queries to be merged together
     *
     * @param config The config to use for merging
     */
    merge<R>(config: IAggregationQueryMergeConfig): IAggregationQueryResult<R>;

    /**
     * Simple iteration over all items returned in the result
     *
     * @param fn
     */
    forEach(fn: (item: T, keyPath: string[]) => void): void;

}

export interface IAggregationQueryMergeConfig {
    withQueries: IAggregationQueryResult<any>[];
    merger: (results: any[]) => any;
}


export class AggregationQueryResult<T> implements IAggregationQueryResult<T> {

    private _results: IAggregatorSliceResult<any>[] | any[];
    private _query: IAggregatorSliceQueryConfig;
    private _depth: number;

    constructor(config: {
        results: IAggregatorSliceResult<any>[] | any[];
        query: IAggregatorSliceQueryConfig
    }) {

        this._results = config.results;
        this._query = config.query;
        this._depth = Object.keys(config.query).length;

    }

    public results(): IAggregatorSliceResult<any>[] {
        return this._results;
    }

    public forEach(fn: (item: T, keyPath: string[]) => void): void {

        const maxDepth: number = this._depth;

        const recurse = (
            currentResults: IAggregatorSliceResult<any>[] | any[],
            currentKeys: string[],
            currentDepth: number
        ) => {

            if (currentDepth === maxDepth) {
                currentResults.forEach(item => fn(item, currentKeys));
            } else {
                currentResults.forEach(result => recurse(
                    result.items,
                    [...currentKeys, result.key],
                    currentDepth + 1
                ));
            }

        }

        recurse(this._results, [], 0);

    }

    public merge<R>({ withQueries, merger }: IAggregationQueryMergeConfig): IAggregationQueryResult<R> {

        const maxDepth: number = this._depth;

        const recurse = (
            currentSlices: any[],
            currentDepth: number
        ): any => {

            if (currentDepth === maxDepth) {
                return merger(currentSlices);
            } else {

                const keyIndices = {};
                const appendedSlices = currentSlices.flat().reduce((acc, slice, index, arr) => {

                    if (typeof keyIndices[slice.key] !== 'number') {
                        keyIndices[slice.key] = index;
                        slice.items = [slice.items];
                        acc.push(slice);
                    } else {
                        const existingSlice = acc[keyIndices[slice.key]];
                        existingSlice.items.push(slice.items);
                    }

                    return acc;

                }, []);

                return appendedSlices.map(slice => {
                    slice.items = recurse(slice.items, currentDepth + 1);
                    return slice;
                });

            }

        }

        const results = recurse([this._results, ...withQueries.map(q => q.results())], 0);

        return new AggregationQueryResult({
            results,
            query: { ...this._query }
        });

    }


}
