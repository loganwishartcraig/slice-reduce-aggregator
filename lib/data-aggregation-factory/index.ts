/**
 * The DataAggregationFactory is responsible for producing the
 * concrete instance of a class that implements the IDataAggregation
 * interface.
 *
 * This class exists to abstract & localize the logic that determines
 * which concrete instance to return, away from the classes that require use of
 * objects that conform to the interface.
 *
 * The IDataAggregation interface was created to provide a common interface for
 * both 'leaf parent' nodes (DataGroup), and non-leaf parent nodes (DataSubAggregation)
 * which have different internal representations of their data set, but should provide
 * the same operations externally.
 *
 */


import { IAggregator, IAggregatorSliceQueryConfig, IAggregatorSliceResult } from "../types";
import { DataSubAggregation } from "../data-sub-aggregation";
import { DataGroup } from "../data-group";


/**
 * The interface by which internal nodes in an
 * AggregatedDataSet tree conform to.
 *
 * @typeparam {T} The shape of the objects being stored in the node
 */
export interface IDataAggregation<T> {

    /**
     * Adds an item to the aggregation.
     *
     * @param item The item to add
     */
    push(item: T): T;

    /**
     * Performs the 'slice' operation on the node sub-tree
     *
     * @param query The query to return the slice for
     */
    slice(query: IAggregatorSliceQueryConfig): IAggregatorSliceResult<T[]>[] | T[];

    /**
     * Allows iteration over all objects in the aggregation
     *
     * @param fn The function to call. Receives a 'keyPath' property
     */
    forEach(fn: (item: T, keyPath: string[]) => any): void;

    /**
     * Removes all containers & items within the aggregation
     */
    purge(): void;

    /**
     * Returns the number of elements in the aggregation.
     * Size is defined as the number of elements rooted at
     * the subtree.
     */
    size(): number;

}

export class DataAggregationFactory {

    public static build<T>(config: IAggregator<T>, subAggregators: IAggregator<T>[] = []): IDataAggregation<T> {

        // If there are more aggregations that need to be applied,
        // we return a sub-aggregation as the aggregation does not represent
        // a 'leaf-parent', otherwise we return a DataGroup
        if (subAggregators.length) {
            return new DataSubAggregation<T>(config, subAggregators);
        } else {
            return new DataGroup<T>(config);
        }
    }

}
