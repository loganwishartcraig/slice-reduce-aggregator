import LeafNode from "../base";
export default class SetLeaf<T> extends LeafNode<T, 'set'> {
    protected _initChildren(): Set<T>;
    add(item: T): void;
    remove(item: T): void;
    purge(): void;
    size(): number;
    leaves(): T[];
}
