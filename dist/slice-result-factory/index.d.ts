import SubsetTree from '../subset-tree';
import SliceResult from '../slice-result';
import { ContainerType } from '../types';
export default class SliceResultFactory {
    static build<T, C extends ContainerType>(tree: SubsetTree<T, C>): SliceResult<T, C>;
}
