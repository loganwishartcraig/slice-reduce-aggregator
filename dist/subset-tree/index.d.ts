import { ContainerType, IAggregator } from "../types";
import Node, { INodeRemoveOptions } from "../node";
import SliceQuery, { IQueryConfig } from "../slice-query";
import SliceResult from "../slice-result";
export interface ISubsetTreeConfig<T, C extends ContainerType> {
    containerType: C;
    aggregators: IAggregator<T>[];
    idAccessor: (item: T) => any;
}
export default class SubsetTree<T, C extends ContainerType> {
    private _root;
    private _containerType;
    private _aggregators;
    private _aggregationOrder;
    private _cachedQueries;
    private _nextQueryId;
    private _idAccessor;
    constructor(config: ISubsetTreeConfig<T, C>);
    protected _initRootNode(): Node<T, C>;
    add(item: T): void;
    remove(item: T, options?: INodeRemoveOptions): void;
    purge(): void;
    freeCachedQueries(): void;
    getCachedQuery(id: number): SliceQuery<T, C> | void;
    size(): number;
    getRoot(): Node<T, C>;
    getContainerType(): ContainerType;
    getIdAccessor(): (item: T) => any;
    getAggregationOrder(): string[];
    slice(config: IQueryConfig): SliceResult<T, C>;
    getItemKeyPaths(item: T): string[][];
}
