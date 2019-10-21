
/**
 * Describes the shape for a slice query
 * for use with an AggregatedDataSet
 *
 * The object keys should correspond to aggregator names,
 * with values corresponding to an array of keys to pull objects
 * from for the given aggregator. A '*' can be used query for all
 * keys currently in the aggregator.
 *
 * As of now, ALL aggregators should be provided values.
 *
 * @example
 *
 * // assumes an AggregatedDataSet is indexing items by C_DATE -> DEP_NUM -> STATUS.
 *
 * const sliceQuery = {
 *     C_DATE: ['2/2/18', '3/3/19'],
 *     DEP_NUM: '*',
 *     STATUS: ['CREATED']
 * };
 *
 * // When used with 'slice', would return an IAggregatorSliceResult object
 * // That contains all items with C_DATE of '2/2/18' or '3/3/19', sub indexed
 * // by DEP_NUM (any value), sub indexed by STATUS of 'CREATED'
 *
 */
export type IAggregatorSliceQueryConfig = {
    [aggName: string]: any[] | '*';
};


/**
 * Represents a single aggregation step
 *
 * @typeparam {T} The type of object being aggregated
 *
 * @example
 *
 * const aggregator = {
 *     name: 'STATUS',
 *     keyAccessor: (order) => order.status || 'NONE',
 * };
 *
 * // When used with an AggregatedDataSet, will index items by their order status.
 */
export interface IAggregator<T> {

    /** The name of the aggregator. Used for querying the aggregation */
    name: string;

    /**
     * The function that resolves the 'key' or 'keys' associated with the item for this aggregation.
     */
    keyAccessor: (item: T) => string | string[] | void;

}


/**
 * Represents the shape of the result as returned
 * by a 'slice' query. A recursive structure
 *
 * @typeparam {T} The type of object being aggregated
 */
export interface IAggregatorSliceResult<T> {

    /** The name of the aggregator associated with items in this result */
    aggregator: string;

    /** The aggregator key value associated with the items in this result */
    key: string;

    /**
     * The items for this level of the result.
     * T if the `aggregator` is the last aggregator for the associated AggregatedDataSet
     * IAggregatorSliceResult<T>[] otherwise, where items represent results of the next aggregator in the AggregatedDataSet
     */
    items: T | IAggregatorSliceResult<T>[];

}
