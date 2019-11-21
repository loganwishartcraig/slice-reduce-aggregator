import { ContainerType, Container } from "../../../types";
import Node, { INodeConfig } from "../../index";
export default abstract class LeafNode<T, C extends ContainerType> extends Node<T, C> {
    protected _children: Container<T, C>;
    constructor(config: INodeConfig<T, C>);
    protected abstract _initChildren(): Container<T, C>;
    abstract remove(item: T): void;
    protected _getId(item: T): any;
    hasChild(key: string): boolean;
    getChildByKey(): Node<T, C> | void;
    getAllChildren(): [string, Node<T, C>][];
    getItemChildren(): [string, Node<T, C>][];
}
