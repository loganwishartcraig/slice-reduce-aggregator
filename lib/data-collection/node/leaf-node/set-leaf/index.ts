import LeafNode from "..";

export default class SetLeaf<T> extends LeafNode<T, 'set'> {

    protected _initChildren(): Set<T> {
        return new Set();
    }

    public add(item: T): void {
        this._children.add(item);
    }

    public remove(item: T): void {
        this._children.delete(item);
    }

    public purge(): void {
        this._children.clear();
    }

    public size(): number {
        return this._children.size;
    }

    public leaves(): T[] {
        return Array.from(this._children.values());
    }
}
