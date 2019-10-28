import { ContainerType, IAggregator } from "../types";
import Node from '../node';
import { ArrayLeaf, MapLeaf, SetLeaf } from "../node/leaf-node";
import PathNode from '../node/path-node';

export default class NodeFactory {

    public static build<T, C extends ContainerType>({
        aggregators: [currentAggregator, ...nextAggregators] = [],
        idAccessor,

        containerType,
        key,
        parent
    }: {
        aggregators: IAggregator<T>[],
        idAccessor: (item: T) => any,
        containerType: ContainerType,
        key: string,
        parent: Node<T, C> | void
    }): Node<T, C> {

        const config = {
            key,
            parent,
            containerType,
            idAccessor
        };

        if (!currentAggregator) {
            switch (containerType) {
                case 'array':
                    return new ArrayLeaf(config);
                case 'map':
                    return new MapLeaf(config);
                case 'set':
                    return new SetLeaf(config);
                default:
                    throw new TypeError(`Unknown container type ${containerType}. Cannot create leaf node.`);
            }
        } else {
            return new PathNode({
                ...config,
                aggregator: currentAggregator,
                nextAggregators: nextAggregators,
            });
        }

    }

}
