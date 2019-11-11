import SubsetTree from '../subset-tree';
import SliceResult from '../slice-result';
import ArrayResult from '../slice-result/array-result';
import MapResult from '../slice-result/map-result';
import SetResult from '../slice-result/set-result';
import { ContainerType } from '../types';

export default class SliceResultFactory {
    public static build<T, C extends ContainerType>(tree: SubsetTree<T, C>): SliceResult<T, C> {

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
