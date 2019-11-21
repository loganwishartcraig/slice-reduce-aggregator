import LeafNode from "../base";
export default class MapLeaf<T> extends LeafNode<T, 'map'> {
    protected _initChildren(): Map<any, T>;
    add(item: T): void;
    remove(item: T): void;
    purge(): void;
    size(): number;
    leaves(): T[];
}
