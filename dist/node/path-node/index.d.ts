import { ContainerType, IAggregator } from "../../types";
import Node, { INodeConfig, INodeRemoveOptions } from "..";
export interface IPathNodeConfig<T, C extends ContainerType> extends INodeConfig<T, C> {
    aggregator: IAggregator<T>;
    nextAggregators: IAggregator<T>[];
}
export default class PathNode<T, C extends ContainerType> extends Node<T, C> {
    private _children;
    private _aggregator;
    private _nextAggregators;
    constructor(config: IPathNodeConfig<T, C>);
    add(item: T): void;
    remove(item: T, options: INodeRemoveOptions): void;
    purge(): void;
    size(): number;
    leaves(): T[];
    hasChild(key: string): boolean;
    getChildByKey(key: string): Node<T, C> | void;
    getAllChildren(): [string, Node<T, C>][];
    getItemChildren(item: T): [string, Node<T, C>][];
    private _initChildNode;
    private _hasChildNode;
    private _setChildNode;
    private _getChildNode;
    private _getItemChildrenKeys;
}
