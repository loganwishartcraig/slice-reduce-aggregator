import { Container, ContainerType } from '../types';
export default abstract class SliceResult<T, C extends ContainerType> {
    protected _results: Container<T, C>;
    protected _idAccessor: (item: T) => any;
    constructor({ idAccessor }: {
        idAccessor: (item: T) => any;
    });
    protected abstract _initResultsContainer(): Container<T, C>;
    abstract add(item: T): void;
    abstract remove(item: T): void;
    results(): Container<T, C>;
    protected _getId(item: T): any;
}
