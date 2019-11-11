import { ContainerType, Container } from "../../../types";
import Node, { INodeConfig } from "../../index";

export default abstract class LeafNode<T, C extends ContainerType> extends Node<T, C> {

    protected _children: Container<T, C>;

    constructor(config: INodeConfig<T, C>) {
        super(config);
        this._children = this._initChildren();
    }

    protected abstract _initChildren(): Container<T, C>;

    protected _getId(item: T): any {
        return this._idAccessor(item);
    }

    public hasChild(key: string): boolean {
        return false;
    }

    public getChildByKey(): Node<T, C> | void {
        return undefined;
    }

    public getAllChildren(): [string, Node<T, C>][] {
        return [];
    }

    public getItemChildren(): [string, Node<T, C>][] {
        return [];
    }

}
