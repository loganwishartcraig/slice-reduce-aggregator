/**
 *
 * The AggregatedDataSet class takes a set of objects, provided as an array,
 * and transforms the array representation into a tree representation based
 * on a set of `aggregators`.
 *
 * Each `aggregator` represents a level of the tree, and the nodes of each
 * level represent the image of the set of objects for the `aggregator.keyAccessor`
 * function associated with the level.
 *
 * The leaves of the tree contain a subset of the objects originally provided. The keys
 * associated with nodes on the path from the object (leaf) to the tree root
 * represent the return values associated for each `aggregator.keyAccessor`.
 *
 * The class then implements a light interface for querying the aggregated
 * data set.
 *
 * IMPORTANT LIMITATION: Each `keyAccessor` function, must return
 * a single, non-empty string. In the future, one might add multi-string return, or
 * null returns, but for now, it's a single value. This has the implication that all
 * 'leaf groups' are mutually exclusive, and a set of `aggregators` effectively applies
 * a partition to the original input array.
 *
 * IMPLEMENTATION NOTE: I think there could be a better way to implement this
 * ADT by removing duplicate keys within a level and using graphs & graph exploration
 * algs for iteration, instead of trees. Also, within the current implementation, the
 * 'leaf nodes' should be split into a 'leaf parent' and a 'leaf', where the parent contains
 * the last key, and the 'leaf' is simply a collection of objects.
 *
 * @example
 *
 * const data = [
    *     {key_1: 'a', key_2: '1', key_3: '#'},
    *     {key_1: 'a', key_2: '1', key_3: '#'},
    *     {key_1: 'a', key_2: '2', key_3: '#'},
    *     {key_1: 'a', key_2: '2', key_3: '*'},
    *     {key_1: 'a', key_2: '2', key_3: '*'},
    *     {key_1: 'b', key_2: '1', key_3: '#'},
    *     {key_1: 'b', key_2: '1', key_3: '#'},
    *     {key_1: 'b', key_2: '2', key_3: '*'},
    *     {key_1: 'b', key_2: '2', key_3: '*'},
    *     {key_1: 'b', key_2: '1', key_3: '*'},
    * ];
    *
    * const aggregators = [
    *     {name: 'FIRST_AGG', keyAccessor: ({key_1}) => key_1},
    *     {name: 'SECOND_AGG', keyAccessor: ({key_2}) => `example_${key_2}`},
    *     {name: 'THIRD_AGG', keyAccessor: ({key_3}) => key_3},
    * ];
    *
    * const aggregated = new AggregatedDataSet({ data, aggregators });
    * // The array was transformed into a tree, where each level is an aggregator,
    * // and each node in a level is a value that was returned by the 'keyAccessor'
    * // for some object in it's sub-tree.
    *
    * //
    * //
    * //                                                       +--------+
    * //                                                       | _root_ |
    * //                                        /------------- +--------+--------------\
    * //                     +------------------                                        --------------------+
    * //                     |  a  |                                                                  |  b  |                                   (ancestors - internally DataSubAggregation)
    * //                   /-+-----+                                                              /-- +-----+--\
    * //                 /-         -\                                                      /-----              ----\
    * //  +--------------             -+-------------+                     +----------------                         -----------------+
    * //  |  example_1  |              |  example_2  |                     |  example_1  |                             |  example_2   |         (leaf parents - internally, DataGroup)
    * //  +-------------+              +-------------+                     +-------------+                             +--------------+
    * //        |                    /-              -\                      /-       -\                                      |
    * //      +-|-+               +---+             +-----+              +-----+     +-----+                               +--|--+
    * //      | # |               | * |             |  #  |              |  *  |     |  #  |                               |  *  |              (leaves)
    * //      +---+               +---+             +-----+              +-----+     +-----+                               +-----+
    * //     | 0,1 |             | 3,4 |             | 2 |                | 9 |      | 5,6 |                               | 7,8 |
    * //     +-----+             +-----+             +---+                +---+      +-----+                               +-----+
    *
    */

import { AggregationQueryResult, IAggregationQueryResult } from "../aggregation-query-result";
import { DataAggregationFactory, IDataAggregation } from "../data-aggregation-factory";
import { IAggregator, IAggregatorSliceQueryConfig } from "../types";

/**
 * Configuration options for a new AggregatedDataSet
 *
 * @typeparam {T} The object type being aggregated
 */
export interface IAggregatedDataSetConfig<T> {

    /** The array of data to aggregate */
    data: T[];

    /** The set of aggregators to apply. Aggregators are applied in the order supplied */
    aggregators: IAggregator<T>[];

}

/**
 * The interface by which the 'AggregatedDataSet' adheres to.
 *
 * @typeparam {T} The object type contained in the set
 */
export interface IAggregatedDataSet<T> {

    /**
     * Inserts a single item into the data set
     *
     * @param item The item to insert
     */
    push(item: T): T;

    /**
     * Allows simple iteration over all the elements in the data set.
     *
     * @param fn The function to apply
     */
    forEach(
        fn: (item: T, keyPath: string[]) => void
    ): void;

    /**
     * Empties the structure, removing
     * all indexted items & containers
     */
    purge(): void;

    /**
     * Returns a 'slice' of the data, a pruned sub-tree
     * of the original tree aggregation.
     *
     * @param query The query to retrieve a slice for
     */
    slice(
        query: IAggregatorSliceQueryConfig
    ): IAggregationQueryResult<T[]>;

    /**
     * Allows applying a reducer to the leaves of a common
     * parent as returned by a `slice` query.
     *
     * @param query The query to retrieve the slice for, and reduce over.
     * @param reducer The reducer that will be applied to the leaves of a common parent. 'acc' will initially be set to the result of 'baseBuilder'
     * @param baseBuilder A function that returns a new 'base' reduction value for each new set of leaves. Receives a list of keys corresponding to the path from 'parent->root' for the given collection of leaves.
     */
    sliceReduce<C>(
        query: IAggregatorSliceQueryConfig,
        reducer: (acc: C, item: T) => C,
        baseBuilder: (keyPath: string[]) => C
    ): IAggregationQueryResult<C>;


}


export class AggregatedDataSet<T> implements IAggregatedDataSet<T> {

    /** The root of the aggregation tree. */
    private _rootAggregation: IDataAggregation<T>;

    /** A list of aggregation names in the order they were applied. */
    private _aggregationOrder: string[] = [];

    constructor({
        data,
        aggregators: [rootAggregator, ...subAggregators],
    }: IAggregatedDataSetConfig<T>) {

        this._rootAggregation = DataAggregationFactory.build<T>(rootAggregator, subAggregators);

        this._aggregationOrder = this._resolveAggregationOrder(rootAggregator, subAggregators);

        data.forEach(item => this._rootAggregation.push(item));

    }

    public push(item: T): T {
        this._rootAggregation.push(item);
        return item;
    }

    public forEach(fn: (item: T, keyPath: string[]) => void): void {
        this._rootAggregation.forEach(fn);
    }

    public purge(): void {
        this._rootAggregation.purge();
    }

    public slice(query: IAggregatorSliceQueryConfig): IAggregationQueryResult<T[]> {

        const results = this._rootAggregation.slice(query);

        return new AggregationQueryResult({ results, query, });

    }

    public sliceReduce<C>(
        query: IAggregatorSliceQueryConfig,
        reducer: (acc: C, item: T, index: number, keyPath: string[]) => C,
        baseBuilder: (keyPath: string[]) => C
    ): IAggregationQueryResult<C> {

        const sliceResult = this._rootAggregation.slice(query);

        const orderedAggNames = this._resolveOrderedAggNamesFromQuery(query);

        // A recursive routine to build a new 'slice result'
        // after applying the reduction to the leave groups
        // as returned by the slice query. We mutate the input
        // slice for convenience and speed.
        const recurse = (
            currentSlice: { items: any[] },
            currentKeyPath: string[] = [],
        ): any => {

            // Base case, we've hit the parent of a group of leaves
            // and apply the reducer to its children.
            if (currentKeyPath.length === orderedAggNames.length) {

                currentSlice.items = currentSlice.items.reduce(
                    (acc, item, index) => reducer(acc, item, index, currentKeyPath)
                    , baseBuilder([...currentKeyPath])
                );

            } else {

                // Recursive case, we're at some level, l, such that 0 < l < tree height - 1.
                // We explore each node, n, in l, and recurse on each of n's children.
                currentSlice.items.forEach(nextSlice => {
                    recurse(
                        nextSlice,
                        [...currentKeyPath, nextSlice.key]
                    );
                });

                // Return the current slice for convenience of the original caller.
                return currentSlice;

            }

        }

        // sliceResult is an array, as returned by `slice`, but
        // we conform to the recursive case obj shape expectations of the
        // 'recurse' function for convenience, so we don't have to
        // carve out a special 'start' case. Must extract back out
        // the 'items' property to recover the original array format.
        const results = recurse({ items: sliceResult }).items;

        return new AggregationQueryResult({ results, query });

    }

    private _resolveOrderedAggNamesFromQuery(query: IAggregatorSliceQueryConfig): string[] {
        return this._aggregationOrder.filter(aggName => query[aggName]);
    }

    private _resolveAggregationOrder(rootAggregator: IAggregator<T>, subAggregators: IAggregator<T>[] = []): string[] {

        return subAggregators.reduce(
            (orderedNames, { name }) => {
                orderedNames.push(name);
                return orderedNames;
            },
            [rootAggregator.name]
        );

    }

}
