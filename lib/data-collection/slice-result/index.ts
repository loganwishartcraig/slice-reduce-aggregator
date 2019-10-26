import { Container, ContainerType } from '../types';
import Tree from '../subset-tree';
import ArrayResult from './array-result';
import MapResult from './map-result';
import SetResult from './set-result';


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


export class SliceResultFactory {
    public static build<T, C extends ContainerType>(tree: Tree<T, C>): SliceResult<T, C> {

        const config = {
            idAccessor: tree.getIdAccessor()
        };

        switch (tree.getContainerType()) {
            case 'array':
                return new ArrayResult(config) as any;
            case 'map':
                return new MapResult(config) as any;
            case 'set':
                return new SetResult(config) as any;
            default:
                throw new Error(`Unknown slice result container type ${tree.getContainerType()}`);
        }
    }
}
