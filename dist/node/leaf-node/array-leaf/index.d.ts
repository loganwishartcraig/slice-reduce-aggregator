import LeafNode from "../base";
export default class ArrayLeaf<T> extends LeafNode<T, 'array'> {
    protected _initChildren(): T[];
    add(item: T): void;
    remove(item: T): void;
    purge(): void;
    size(): number;
    leaves(): T[];
}
