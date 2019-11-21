export declare type Container<T, C extends ContainerType> = C extends 'array' ? T[] : C extends 'set' ? Set<T> : C extends 'map' ? Map<any, T> : never;
export declare type ContainerType = 'array' | 'set' | 'map';
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
