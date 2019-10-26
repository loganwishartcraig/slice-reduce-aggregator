import LeafNode from "..";

export default class MapLeaf<T> extends LeafNode<T, 'map'> {

    protected _initChildren(): Map<any, T> {
        return new Map();
    }

    public add(item: T): void {

        const id = this._getId(item);

        if (!this._children.has(id)) {
            this._children.set(id, item);
        }

    }

    public remove(item: T): void {
        const id = this._getId(item);
        this._children.delete(id);
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
