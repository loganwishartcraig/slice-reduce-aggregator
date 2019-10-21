/**
 * The DataGroup class represents a 'leaf parent' node in the
 * AggregatedDataSet tree. Internally, it contains a mapping
 * of 'keys' to 'object arrays'. Each key/object array pair is
 * considered a 'leaf' of the tree.
 */

import { IDataAggregation } from "../data-aggregation-factory";
import { IAggregator, IAggregatorSliceQueryConfig, IAggregatorSliceResult } from "../types";

export class DataGroup<T> implements IDataAggregation<T> {

    private _voidKey = '___VOID___' as const;
    private _leaves: { [key: string]: T[] } = {
        [this._voidKey]: []
    };

    private _config: IAggregator<T>;

    constructor(config: IAggregator<T>) {

        if (!config || typeof config !== 'object') {
            throw new TypeError('Configuration must be an object');
        } else if (typeof config.name !== 'string') {
            throw new TypeError(`config.name must be a string. Received ${typeof config.name}`);
        } else if (typeof config.keyAccessor !== 'function') {
            throw new TypeError(`config.keyAccessor must be a function. Received ${typeof config.keyAccessor}`);
        }

        this._config = config;

    }

    /**
     * Adds an item to the correct leaf,
     * given the key as returned by the `aggregator.KeyAccessor`
     * for this DataGroup.
     *
     * @param item The item to add
     */
    public push(item: T): T {

        if (typeof item === 'undefined' || item === null) {
            return item;
        }

        const keys = this._resolveItemKeys(item)
        const leaves = this._resolveLeaves(keys);

        if (leaves) {
            leaves.forEach(leaf => leaf.push(item));
        }

        return item;

    }

    /**
     * Removes all entries
     */
    public purge(): void {
        this._leaves = {};
    }

    /**
     * Returns the size of the aggregation.
     */
    public size(): number {
        return Object
            .values(this._leaves)
            .reduce((count, { length }) => count + length, 0);
    }

    public slice(query: IAggregatorSliceQueryConfig): IAggregatorSliceResult<T[]>[] | T[] {

        const keys = this._resolveKeysForSliceQuery(query);
        const base: any[] = [];

        // If no keys are provided in the query,
        // we return as though this node is a collection
        // of objects itself, rather than an aggregation.
        if (!keys) {
            this.forEach(item => base.push(item))
        } else {

            // Otherwise we return the aggregator slice result for
            // all keys provided.
            keys.forEach(key => {
                base.push({
                    aggregator: this._config.name,
                    key,
                    items: this._getByKey(key)
                });
            });

        }

        return base;

    }

    public forEach(fn: (item: T, keyPath: string[]) => void): void {

        // Simple loop over the contents of each leaf.
        Object.entries(this._leaves).forEach(([key, value]) => {
            value.forEach(item => fn(item, [key]))
        });

    }

    private _resolveKeysForSliceQuery(query: IAggregatorSliceQueryConfig): string[] {

        const queryKeys = query[this._config.name]

        // The '*' in a query implies 'use all keys'
        if (queryKeys === '*') {
            return Object.keys(this._leaves)
        }

        return queryKeys;

    }

    private _getByKey(key: string): T[] {

        if (!key || typeof key !== 'string' || !this._leaves.hasOwnProperty(key)) {
            return [];
        } else {
            return this._leaves[key];
        }

    }

    private _resolveItemKeys(item: T): string[] {

        const key = this._config.keyAccessor(item);

        if (Array.isArray(key)) {
            return key.filter(entry => {

                const isValid = this._isValidKey(entry);

                if (!isValid) {
                    this._handleInvalidKey(entry);
                }

                return isValid;

            }).map(entry => this._serializeKey(entry));
        }

        if (!this._isValidKey(key)) {
            this._handleInvalidKey(key);
            return [];
        }

        return [this._serializeKey(key)];
    }

    private _resolveLeaves(keys: string[]): T[][] | void {

        return keys.map(key => {

            if (!this._leaves.hasOwnProperty(key)) {
                this._initLeaf(key);
            }

            return this._leaves[key];

        });

    }

    private _initLeaf(key: string): T[] {

        if (typeof key !== 'string' && typeof key !== 'number') {
            throw new TypeError('Key provided to leaf initialization must be a string or number')
        }

        this._leaves[key] = [];
        return this._leaves[key];

    }

    private _handleInvalidKey(key: string | void): void {

        console.warn('[DataAggregator] - Received non-string key for item', {
            key,
            aggregation: this._config.name
        });

    }

    private _isValidKey(key: string | void): boolean {
        return typeof key === 'string' || key === null;
    }

    private _serializeKey(key: string | void): string {

        if (key === null) {
            return this._voidKey;
        } else if (typeof key === 'string') {
            return key;
        } else {
            throw new TypeError(`Cannot serialize non-null, non-string key: ${key}`);
        }

    }

}
