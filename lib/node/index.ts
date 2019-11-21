import { ContainerType } from "../types";
import { _globalLogger } from "../utils/logger";
import NodeFactory from "../node-factory";


export interface INodeConfig<T, C extends ContainerType> {
    key: string;
    parent: Node<T, C> | void;
    containerType: ContainerType;
    idAccessor: (item: T) => any;
}

export interface INodeRemoveOptions {
    useExhaustiveSearch?: boolean;
}

export default abstract class Node<T, C extends ContainerType> {

    public readonly key: string;
    public readonly parent: Node<T, C> | void
    protected _containerType: ContainerType;
    protected _idAccessor: (item: T) => any;

    constructor({
        key,
        parent,
        containerType,
        idAccessor
    }: INodeConfig<T, C>) {

        if (typeof key !== 'string') {
            throw new TypeError(`A Node sub-class was instantiated with a non-string 'key'. All nodes must be instantiated with a string key. Empty strings are permitted. Received: ${key}`);
        } else if (!NodeFactory.isValidContainerType(containerType)) {
            throw new TypeError(`A Node sub-class was instantiated with an invalid 'containerType'. Valid container types are ${NodeFactory.validContainerTypes.join(', ')}. Received: ${containerType}`);
        } else if (typeof idAccessor !== 'function') {
            throw new TypeError(`A Node sub-class was instantiated with a non-function 'idAccessor'. All 'idAccessors' should be of the signature (item: T) => string | void | (string | void)[]. Received: ${idAccessor}`);
        } else if (parent && !(parent instanceof Node)) {
            throw new TypeError(`A Node sub-class was instantiated with a non-null, non-Node 'parent'. All node parent's must be undefined, or extend the abstract Node class. Received ${parent}`);
        }

        this.key = key;
        this.parent = parent;
        this._containerType = containerType;
        this._idAccessor = idAccessor;

    }

    public abstract add(item: T): void;
    public abstract remove(item: T, options: INodeRemoveOptions): void;
    public abstract purge(): void;
    public abstract size(): number;
    public abstract leaves(): T[];

    public abstract getChildByKey(key: string): Node<T, C> | void;
    public abstract hasChild(key: string): boolean;
    public abstract getAllChildren(): [string, Node<T, C>][];
    public abstract getItemChildren(item: T): [string, Node<T, C>][];

}

