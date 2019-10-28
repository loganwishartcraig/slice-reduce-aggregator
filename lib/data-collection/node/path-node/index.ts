import { ContainerType, IAggregator } from "../../types";
import Node, { INodeConfig } from "..";
import { Utils } from "../../utils";
import NodeFactory from "../../node-factory";

export interface IPathNodeConfig<T, C extends ContainerType> extends INodeConfig<T, C> {
    aggregator: IAggregator<T>;
    nextAggregators: IAggregator<T>[];
}

export default class PathNode<T, C extends ContainerType> extends Node<T, C> {


    private _children: { [key: string]: Node<T, C>; } = {};
    private _aggregator: IAggregator<T>;
    private _nextAggregators: IAggregator<T>[];

    constructor(config: IPathNodeConfig<T, C>) {
        super(config);
        this._aggregator = config.aggregator;
        this._nextAggregators = config.nextAggregators;
    }

    public add(item: T): void {

        this._getItemChildrenKeys(item).forEach(key => {

            if (!this._hasChildNode(key)) {
                this._setChildNode(key, this._initChildNode(key))
            }

            this._getChildNode(key).add(item);

        });

    };

    public remove(item: T): void {

        this._getItemChildrenKeys(item).forEach(key => {

            if (this._hasChildNode(key)) {
                this._getChildNode(key).remove(item);
            }

        });

    };

    public purge(): void {
        this._children = {};
    };

    public size(): number {

        return Object.values(this._children).reduce(
            (sum, child) => sum + child.size(),
            0
        );

    };

    public leaves(): T[] {

        return Object
            .values(this._children)
            .reduce((leaves, node) => leaves.concat(node.leaves()), [] as T[]);

    }

    public hasChild(key: string): boolean {
        return this._hasChildNode(key);
    }

    public getChildByKey(key: string): Node<T, C> | void {
        return this._getChildNode(key);
    }

    public getAllChildren(): [string, Node<T, C>][] {
        return Object.entries(this._children);
    }

    private _initChildNode(key: string): Node<T, C> {

        return NodeFactory.build({
            key,
            aggregators: this._nextAggregators,
            containerType: this._containerType,
            idAccessor: this._idAccessor,
            parent: this
        });

    }

    private _hasChildNode(key: string): boolean {
        return this._children.hasOwnProperty(key);
    }

    private _setChildNode(key: string, node: Node<T, C>) {
        this._children[key] = node;
    }

    private _getChildNode(key: string): Node<T, C> {
        return this._children[key];
    }

    private _getItemChildrenKeys(item: T): string[] {

        return Utils.resolveItemKey(item, this._aggregator);

    }


}
