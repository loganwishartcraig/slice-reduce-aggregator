import { Container, ContainerType } from '../types';

export default abstract class SliceResult<T, C extends ContainerType> {

    protected _results: Container<T, C>;
    protected _idAccessor: (item: T) => any;

    constructor({
        idAccessor
    }: {
        idAccessor: (item: T) => any;
    }) {
        this._results = this._initResultsContainer();
        this._idAccessor = idAccessor;
    }

    protected abstract _initResultsContainer(): Container<T, C>;

    public abstract add(item: T): void;
    public abstract remove(item: T): void;

    public results(): Container<T, C> {
        return this._results;
    }

    protected _getId(item: T): any {
        return this._idAccessor(item);
    }

}
