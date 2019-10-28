import { ContainerType } from "../types";


export interface INodeConfig<T, C extends ContainerType> {
    key: string;
    parent: Node<T, C> | void;
    containerType: ContainerType;
    idAccessor: (item: T) => any;
}

export default abstract class Node<T, C extends ContainerType> {

    protected _key: string;
    protected _parent: Node<T, C> | void
    protected _containerType: ContainerType;
    protected _idAccessor: (item: T) => any;

    constructor({
        key,
        parent,
        containerType,
        idAccessor: matcher
    }: INodeConfig<T, C>) {
        this._key = key;
        this._parent = parent;
        this._containerType = containerType;
        this._idAccessor = matcher;
    }

    public abstract add(item: T): void;
    public abstract remove(item: T): void;
    public abstract purge(): void;
    public abstract size(): number;
    public abstract leaves(): T[];

    public abstract getChildByKey(key: string): Node<T, C> | void;
    public abstract hasChild(key: string): boolean;
    public abstract getAllChildren(): [string, Node<T, C>][];

}

