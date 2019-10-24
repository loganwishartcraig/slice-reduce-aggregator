import { DataAggregationFactory, IDataAggregation } from "../data-aggregation-factory";
import { IAggregator, IAggregatorQueryConfig, IAggregatorSliceResult, IDataMatcher } from "../types";
import { AggregatedDataSet } from "..";
import { DataGroup } from "../data-group";


export class DataSubAggregation<T> implements IDataAggregation<T> {

    private _children: { [key: string]: IDataAggregation<T> } = {};
    private _subAggregators: IAggregator<T>[];

    private _matcher: IDataMatcher<T>;
    private _config: IAggregator<T>;

    constructor(config: IAggregator<T>, subAggregators: IAggregator<T>[] = [], matcher: IDataMatcher<T> = (a, b) => a === b) {

        this._matcher = matcher;
        this._config = config;
        this._subAggregators = subAggregators;

        const [nextAgg, ...remainingAggs] = this._subAggregators;
        this._children[AggregatedDataSet.voidKey] = DataAggregationFactory.build(nextAgg, remainingAggs, matcher);

    }

    public push(item: T): T {

        const key = this._config.keyAccessor(item);
        const containers = this._resolveChildNodes(key);

        containers.map(container => container.push(item));

        return item;

    }

    public remove(item: T): void {

        const key = this._config.keyAccessor(item);
        const containers = this._resolveChildNodes(key);

        containers.map(container => container.remove(item));

    }

    public purge(): void {
        this._children = {};
    }

    public size(): number {
        return Object
            .values(this._children)
            .reduce((sum, aggregation) => sum + aggregation.size(), 0);
    }

    public query(query: IAggregatorQueryConfig): IAggregatorSliceResult<T[]>[] | T[] {

        const keys = this._resolveKeysForSliceQuery(query);
        const base: any[] = [];

        // If no keys are provided in the query,
        // we return as though this node is a collection
        // of objects itself, rather than an aggregation.
        if (!keys) {
            this.forEach(item => base.push(item));
        } else {

            // Otherwise we recursively call slice the
            // child-nodes corresponding to each key.
            keys.forEach(key => {

                const target: IAggregatorSliceResult<T[]> = {
                    key,
                    aggregator: this._config.name,
                    items: []
                };

                const container = this._resolveContainerForSliceRecursion(key)

                if (container) {
                    target.items = container.query(query);
                }

                base.push(target);

            });
        }

        return base;

    }

    public slice(query: IAggregatorQueryConfig): T[] {

        const keys = this._resolveKeysForSliceQuery(query);
        const base: T[] = [];

        // If no keys are provided in the query,
        // we return as though this node is a collection
        // of objects itself, rather than an aggregation.
        if (!keys) {
            this.forEach(item => base.push(item));
        } else {

            // Otherwise we recursively call slice the
            // child-nodes corresponding to each key.
            keys.forEach(key => {

                const container = this._resolveContainerForSliceRecursion(key)

                if (container) {
                    base.push(...container.slice(query));
                }

            });
        }

        return base;

    }

    public forEach(fn: (item: T, keyPath: string[]) => any): void {

        Object.entries(this._children).forEach(([key, value]) => {
            value.forEach((item, keyPath) => fn(item, [key, ...keyPath]));
        });

    }

    private _resolveKeysForSliceQuery(query: IAggregatorQueryConfig): string[] | void {

        const queryKeys = query[this._config.name];

        // The '*' in a query implies 'use all keys'
        if (queryKeys === '*') {
            return Object.keys(this._children);
        }

        return queryKeys;

    }

    private _resolveContainerForSliceRecursion(key: string): IDataAggregation<T> {

        if (typeof key !== 'string') return;

        // This ensures that even if the node
        // corresponding to the given key doesn't exist
        // in the set of children for this node, we return
        // a 'dummy' node so the result slice can correctly populate
        // with empty items
        if (this._children.hasOwnProperty(key)) {

            return this._children[key];

        } else if (this._subAggregators.length) {

            const [nextAgg, ...remainingAggs] = this._subAggregators;
            return DataAggregationFactory.build<T>(nextAgg, remainingAggs, this._matcher);

        }

    }

    private _resolveChildNodes(key: string | string[] | void): IDataAggregation<T>[] {

        if (!key) return [this._children[AggregatedDataSet.voidKey]];

        const keys = (typeof key === 'string') ? [key] : key;

        return keys.map(key => {

            if (!this._children.hasOwnProperty(key)) {
                this._initChildNode(key);
            }

            return this._children[key];

        })

    }

    private _initChildNode(key: string) {

        const [nextAgg, ...remainingAggs] = this._subAggregators;
        this._children[key] = DataAggregationFactory.build<T>(nextAgg, remainingAggs, this._matcher);

    }

}
