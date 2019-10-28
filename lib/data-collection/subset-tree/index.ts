import { ContainerType, IAggregator } from "../types";
import Node from "../node";
import NodeFactory from "../node-factory";
import SliceQuery, { IQueryConfig } from "../slice-query";
import { RootKey } from "../constants";
import SliceResult from "../slice-result";
import { Utils } from "../utils";

export interface ISubsetTreeConfig<T, C extends ContainerType> {
    containerType: C;
    aggregators: IAggregator<T>[];
    idAccessor: (item: T) => any;
}

export default class SubsetTree<T, C extends ContainerType> {

    private _root: Node<T, C>;
    private _containerType: ContainerType;
    private _aggregators: IAggregator<T>[];
    private _aggregationOrder: string[];
    private _cachedQueries: { [id: number]: SliceQuery<T, C> } = {};
    private _nextQueryId: number = 0;

    private _idAccessor: (item: T) => any;

    constructor(config: ISubsetTreeConfig<T, C>) {

        this._containerType = config.containerType;
        this._aggregators = config.aggregators;
        this._idAccessor = config.idAccessor;
        this._aggregationOrder = config.aggregators.map(({ name }) => name);

        this._root = this._initRootNode();
    }

    protected _initRootNode(): Node<T, C> {
        return NodeFactory.build<T, C>({
            aggregators: this._aggregators,
            containerType: this._containerType,
            key: RootKey,
            idAccessor: this._idAccessor,
            parent: undefined
        });
    }

    public add(item: T): void {
        this._root.add(item);
        Object.values(this._cachedQueries).forEach(query => query.append(item));
    }

    public remove(item: T): void {
        this._root.remove(item);
        Object.values(this._cachedQueries).forEach(query => query.remove(item));
    }

    public purge(): void {
        this._root.purge();
        this._cachedQueries = {};
    }

    public freeCachedQueries(): void {
        this._cachedQueries = {};
    }

    public getCachedQuery(id: number): SliceQuery<T, C> | void {
        return this._cachedQueries[id];
    }

    public size(): number {
        return this._root.size();
    }

    public getRoot(): Node<T, C> {
        return this._root;
    }

    public getContainerType(): ContainerType {
        return this._containerType;
    }

    public getIdAccessor(): (item: T) => any {
        return this._idAccessor;
    }

    public getAggregationOrder(): string[] {
        return [...this._aggregationOrder];
    }

    public slice(config: IQueryConfig): SliceResult<T, C> {

        const query = new SliceQuery({
            ...config,
            id: this._nextQueryId++
        }, this);

        if (config.cache) {
            // Need to be careful about managing cached queries.
            // It could cause a memory leak cache is never freed.
            this._cachedQueries[query.id] = query;
        }

        return query.exec();

    }

    public getItemKeyPaths(item: T): string[][] {
        return this._aggregators.map(agg => Utils.resolveItemKey(item, agg));
    }


}
