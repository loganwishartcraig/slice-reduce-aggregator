import { ContainerType, IAggregator } from "../types";
import Node from '../node';
export default class NodeFactory {
    static validContainerTypes: string[];
    static build<T, C extends ContainerType>({ aggregators: [currentAggregator, ...nextAggregators], idAccessor, containerType, key, parent }: {
        aggregators: IAggregator<T>[];
        idAccessor: (item: T) => any;
        containerType: ContainerType;
        key: string;
        parent: Node<T, C> | void;
    }): Node<T, C>;
    static isValidContainerType<C extends ContainerType>(type: C): boolean;
}
