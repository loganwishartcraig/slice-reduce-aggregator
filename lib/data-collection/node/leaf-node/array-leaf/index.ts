import LeafNode from "..";

export default class ArrayLeaf<T> extends LeafNode<T, 'array'> {

    protected _initChildren(): T[] {
        return [];
    }

    public add(item: T): void {

        const [existing] = this._children.filter(existing => this._getId(item) !== this._getId(existing));

        if (!existing) {
            this._children.push(item);
        }

    }

    public remove(item: T): void {

        let index: number | void = undefined;

        for (let i = 0, len = this._children.length; i < len; i++) {
            if (this._getId(item) === this._getId(this._children[i])) {
                index = i;
                break;
            }
        }

        if (typeof index === 'number') {
            this._children.splice(index, 0);
        }

    }

    public purge(): void {
        this._children.splice(0, this._children.length);
    }

    public size(): number {
        return this._children.length;
    }

    public leaves(): T[] {
        return this._children.slice();
    }

}
