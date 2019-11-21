import { ContainerType } from "../types";
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
    readonly key: string;
    readonly parent: Node<T, C> | void;
    protected _containerType: ContainerType;
    protected _idAccessor: (item: T) => any;
    constructor({ key, parent, containerType, idAccessor }: INodeConfig<T, C>);
    abstract add(item: T): void;
    abstract remove(item: T, options: INodeRemoveOptions): void;
    abstract purge(): void;
    abstract size(): number;
    abstract leaves(): T[];
    abstract getChildByKey(key: string): Node<T, C> | void;
    abstract hasChild(key: string): boolean;
    abstract getAllChildren(): [string, Node<T, C>][];
    abstract getItemChildren(item: T): [string, Node<T, C>][];
}
