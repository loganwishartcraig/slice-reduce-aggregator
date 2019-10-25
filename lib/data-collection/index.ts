export type Container<T = any> = Map<any, T> | Set<T> | T[];
export type ContainerType = 'array' | 'set' | 'map';

/**
 * Represents a single aggregation step
 *
 * @typeparam {T} The type of object being aggregated
 *
 * @example
 *
 * const aggregator = {
 *     name: 'STATUS',
 *     keyAccessor: (order) => order.status || 'NONE',
 * };
 *
 * // When used with an AggregatedDataSet, will index items by their order status.
 */
export interface IAggregator<T> {

    /** The name of the aggregator. Used for querying the aggregation */
    name: string;

    /**
     * The function that resolves the 'key' or 'keys' associated with the item for this aggregation.
     */
    keyAccessor: (item: T) => string | string[] | void;

}


export interface ITreeConfig<T = any> {
    containerType: ContainerType;
    aggregators: IAggregator<T>[];
    idAccessor: (item: T) => any;
}

export class NodeFactory {

    public static build<T, C extends Container<T>>({
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

export interface BaseCondition extends Array<any> {
    0: 'eq' | 'ne' | 'in' | 'out' | 'any' | 'null';
    1?: string | string[] | true;
};

export interface EqualityCondition extends BaseCondition {
    0: 'eq';
    1: string;
}

export interface NonEqualityCondition extends BaseCondition {
    0: 'ne';
    1: string;
}

export interface InCondition extends BaseCondition {
    0: 'in';
    1: string[];
}

export interface OutCondition extends BaseCondition {
    0: 'out';
    1: string[];
}

export interface AnyCondition extends BaseCondition {
    0: 'any';
}

export interface NullCondition extends BaseCondition {
    0: 'null';
}

export type QueryCondition = EqualityCondition |
    NonEqualityCondition |
    InCondition |
    OutCondition |
    AnyCondition |
    NullCondition;

export interface IQueryConfig {
    conditions: {
        [aggName: string]: QueryCondition;
    };
    cache?: boolean;
}

export default class Tree<T = any, C extends Container<T> = T[]> {

    private static _RootNodeKey = '__ROOT__' as const;

    private _root: Node<T, C>;
    private _containerType: ContainerType;
    private _aggregators: IAggregator<T>[];
    private _aggregationOrder: string[];
    private _cachedQueries: Set<SliceQuery<T, C>> = new Set()

    private _idAccessor: (item: T) => any;

    constructor(config: ITreeConfig<T>) {

        this._containerType = config.containerType;
        this._aggregators = config.aggregators;
        this._idAccessor = config.idAccessor;
        this._aggregationOrder = config.aggregators.map(({ name }) => name);

        this._root = this._initRootNode();
    }

    protected _initRootNode(): Node<T, C> {
        return NodeFactory.build<T, C>({
            aggregators: this._aggregators,
            containerType: this._containerType,
            key: Tree._RootNodeKey,
            idAccessor: this._idAccessor,
            parent: undefined
        });
    }

    public add(item: T): void {
        this._root.add(item);
        this._cachedQueries.forEach(query => query.append(item));
    }

    public remove(item: T): void {
        this._root.remove(item);
        this._cachedQueries.forEach(query => query.remove(item));
    }

    public purge(): void {
        this._root.purge();
        this._cachedQueries = new Set();
    }

    public resetCachedQueries(): void {
        this._cachedQueries = new Set();
    }

    public size(): number {
        return this._root.size();
    }

    public getRoot(): Node<T, C> {
        return this._root;
    }

    public getContainerType(): ContainerType {
        return this._containerType;
    }

    public getIdAccessor(): (item: T) => any {
        return this._idAccessor;
    }

    public getAggregationOrder(): string[] {
        return [...this._aggregationOrder];
    }

    public slice(config: IQueryConfig): C {

        const query = new SliceQuery(config, this);

        if (config.cache) {
            // WILL CAUSE A MEMORY LEAK.
            // Need a way to not execute the same query or remove
            // from memory on component unmount.
            this._cachedQueries.add(query);
        }

        return query.exec().results();

    }

    public getItemKeyPaths(item: T): string[][] {

        const keyPath = this._aggregators.map(({ keyAccessor }) => {

            const key = keyAccessor(item);

            if (typeof key === 'string') {
                return [key];
            } else if (key === undefined || key === null) {
                return [PathNode.VoidKey];
            } else if (Array.isArray(key)) {
                return key
            } else {
                return [];
            }

        });

        console.log(keyPath);

        return keyPath;

    }

}

export interface INodeConfig<T, C extends Container<T>> {
    key: string;
    parent: Node<T, C> | void;
    containerType: ContainerType;
    idAccessor: (item: T) => any;
}

export abstract class Node<T, C extends Container<T>> {

    protected _key: string;
    protected _parent: Node<T, C> | void
    protected _containerType: ContainerType;
    protected _idAccessor: (item: T) => any;

    constructor({
        key,
        parent,
        containerType,
        idAccessor: matcher
    }: INodeConfig<T, C>) {
        this._key = key;
        this._parent = parent;
        this._containerType = containerType;
        this._idAccessor = matcher;
    }

    public abstract add(item: T): void;
    public abstract remove(item: T): void;
    public abstract purge(): void;
    public abstract size(): number;
    public abstract leaves(): T[];

    public abstract getChildByKey(key: string): Node<T, C> | void;
    public abstract hasChild(key: string): boolean;
    public abstract getAllChildren(): [string, Node<T, C>][];

}

export interface IPathNodeConfig<T, C extends Container<T>> extends INodeConfig<T, C> {
    aggregator: IAggregator<T>;
    nextAggregators: IAggregator<T>[];
}

export class PathNode<T, C extends Container<T>> extends Node<T, C> {

    public static VoidKey = '__VOID__' as const;

    private _children: { [key: string]: Node<T, C>; } = {};
    private _aggregator: IAggregator<T>;
    private _nextAggregators: IAggregator<T>[];

    constructor(config: IPathNodeConfig<T, C>) {
        super(config);
        this._aggregator = config.aggregator;
        this._nextAggregators = config.nextAggregators;
    }

    public add(item: T): void {

        this._getItemChildrenKeys(item).forEach(key => {

            if (!this._hasChildNode(key)) {
                this._setChildNode(key, this._initChildNode(key))
            }

            this._getChildNode(key).add(item);

        });

    };

    public remove(item: T): void {

        this._getItemChildrenKeys(item).forEach(key => {

            if (this._hasChildNode(key)) {
                this._getChildNode(key).remove(item);
            }

        });

    };

    public purge(): void {
        this._children = {};
    };

    public size(): number {

        return Object.values(this._children).reduce(
            (sum, child) => sum + child.size(),
            0
        );

    };

    public leaves(): T[] {

        return Object
            .values(this._children)
            .reduce((leaves, node) => leaves.concat(node.leaves()), [] as T[]);

    }

    public hasChild(key: string): boolean {
        return this._hasChildNode(key);
    }

    public getChildByKey(key: string): Node<T, C> | void {
        return this._getChildNode(key);
    }

    public getAllChildren(): [string, Node<T, C>][] {
        return Object.entries(this._children);
    }

    private _initChildNode(key: string): Node<T, C> {

        return NodeFactory.build({
            key,
            aggregators: this._nextAggregators,
            containerType: this._containerType,
            idAccessor: this._idAccessor,
            parent: this
        });

    }

    private _hasChildNode(key: string): boolean {
        return this._children.hasOwnProperty(key);
    }

    private _setChildNode(key: string, node: Node<T, C>) {
        this._children[key] = node;
    }

    private _getChildNode(key: string): Node<T, C> {
        return this._children[key];
    }

    private _getItemChildrenKeys(item: T): string[] {

        const key = this._aggregator.keyAccessor(item);

        if (typeof key === 'string') {
            return [key];
        } else if (key === undefined || key === null) {
            return [PathNode.VoidKey];
        } else if (Array.isArray(key)) {
            return key;
        } else {
            console.error('[PathNode] - An aggregators key accessor returned a value that was not (string | string[] | void)', {
                key,
                aggregator: this._aggregator
            });
            return [];
        }

    }

}

export abstract class LeafNode<T, C extends Container<T>> extends Node<T, C> {

    protected _children: C;

    constructor(config: INodeConfig<T, C>) {
        super(config);
        this._children = this._initChildren();
    }

    protected abstract _initChildren(): C;

    protected _getId(item: T): any {
        return this._idAccessor(item);
    }

    public hasChild(key: string): boolean {
        return false;
    }

    public getChildByKey(): Node<T, C> | void {
        return undefined;
    }

    public getAllChildren(): [string, Node<T, C>][] {
        return [];
    }

}

export class MapLeaf<T> extends LeafNode<T, Map<any, T>> {

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

export class SetLeaf<T> extends LeafNode<T, Set<T>> {

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

export class ArrayLeaf<T> extends LeafNode<T, T[]> {

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

export class SliceResultFactory {
    public static build<T, C extends Container<T>>(tree: Tree<T, C>): SliceResult<T, C> {

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

export class SliceQuery<T, C extends Container<T>> {

    private _query: IQueryConfig;
    private _result: SliceResult<T, C>;
    private _tree: Tree<T, C>;

    private _executed: boolean = false;

    constructor(config: IQueryConfig, tree: Tree<T, C>) {
        this._query = config;
        this._tree = tree;
        this._result = SliceResultFactory.build<T, C>(tree);
    }

    private _resolveNextBFSNodes({
        currentNode,
        condition: [operator, value] = ['any'],
        currentAggregationKey
    }: {
        currentNode: Node<T, C>,
        condition: QueryCondition,
        currentAggregationKey: string
    }): Node<T, C>[] {

        switch (operator) {

            case 'eq':
                return [currentNode.getChildByKey(value as string)]
                    .filter(item => !!item) as Node<T, C>[];
            case 'in':
                return (value as string[])
                    .map(key => currentNode.getChildByKey(key))
                    .filter(item => !!item) as Node<T, C>[]
            case 'ne':
                return currentNode
                    .getAllChildren()
                    .filter(([key, _node]) => key !== value)
                    .map(([_key, node]) => node) as Node<T, C>[];
            case 'out':
                return currentNode
                    .getAllChildren()
                    .filter(([key, _node]) => !(value as string[]).includes(key))
                    .map(([_key, node]) => node) as Node<T, C>[];
            case 'any':
                return currentNode
                    .getAllChildren()
                    .map(([_key, node]) => node) as Node<T, C>[];
            case 'null':
                return [currentNode.getChildByKey(PathNode.VoidKey)]
                    .filter(item => !!item) as Node<T, C>[];
            default:
                // console.error(`Unknown slice operator ${operator} for aggregation ${currentAggregationKey}`);
                // return [];

                // Assume 'nothing provided' means any key.
                return currentNode
                    .getAllChildren()
                    .map(([_key, node]) => node) as Node<T, C>[];

        }

    }

    public exec(): SliceResult<T, C> {

        if (this._executed) return this._result;

        const { conditions } = this._query;

        const recurse = (
            currentNode: Node<T, C>,
            [currentAggregationKey, ...remainingAggregationKeys]: string[] = [],
        ): void => {

            if (!currentNode) {
                return;
            }

            if (!currentAggregationKey) {
                return currentNode.leaves().forEach(item => this._result.add(item));
            }

            const condition = conditions[currentAggregationKey] || ['any', true];

            this._resolveNextBFSNodes({ currentNode, condition, currentAggregationKey })
                .forEach(nextNode => recurse(nextNode, remainingAggregationKeys));

        };

        recurse(this._tree.getRoot(), this._tree.getAggregationOrder());

        this._executed = true;

        return this._result;

    }

    public append(item: T): SliceResult<T, C> {

        const { conditions } = this._query;
        const aggKeys = this._tree.getAggregationOrder();
        const keyPath = this._tree.getItemKeyPaths(item);

        for (let i = 0, len = aggKeys.length; i < len; i++) {

            const aggName = aggKeys[i];
            const keys = keyPath[i];

            let meetsCriteria: boolean = false;

            // Try every key value returned to see if any
            // of them match the current level's query criteria
            for (const key of keys) {

                meetsCriteria = this._keyMatchesConditionValue(key, conditions[aggName], aggName);

                // Break early if we know we found a match.
                if (meetsCriteria) {
                    break;
                }

            }

            // If no key value matched the current criteria,
            // we know not to add it to the query result.
            if (!meetsCriteria) {
                console.log('failed on criteria', { keys, condition: conditions[aggName], aggName });
                return;
            }

        }

        console.log('appending item', { item, query: this._query });
        this._result.add(item);

        return this._result;

    }

    private _keyMatchesConditionValue(key: string, [operator, value]: QueryCondition = ['any'], aggName: string): boolean {

        switch (operator) {
            case 'eq':
                return key === value;
            case 'ne':
                return key !== value
            case 'in':
                return (value as string[]).includes(key);
            case 'out':
                return !(value as string[]).includes(key);
            case 'any':
                return true;
            case 'null':
                return key === PathNode.VoidKey;
            default:
                console.error(`Unknown condition operator ${operator} in query for ${aggName}`);
                return false;

        }
    }

    public remove(item: T): SliceResult<T, C> {

        this._result.remove(item);

        return this._result;

    }

}

export abstract class SliceResult<T, C extends Container<T>> {

    protected _results: C;
    protected _idAccessor: (item: T) => any;

    constructor({
        idAccessor
    }: {
        idAccessor: (item: T) => any;
    }) {
        this._results = this._initResultsContainer();
        this._idAccessor = idAccessor;
    }

    protected abstract _initResultsContainer(): C;

    public abstract add(item: T): void;
    public abstract remove(item: T): void;

    public results(): C {
        return this._results;
    }

    protected _getId(item: T): any {
        return this._idAccessor(item);
    }

}

export class MapResult<T> extends SliceResult<T, Map<any, T>> {

    protected _initResultsContainer(): Map<any, T> {
        return new Map();
    }

    public add(item: T): void {
        this._results.set(this._getId(item), item);
    }

    public remove(item: T): void {
        this._results.delete(this._getId(item));
    }

}

export class SetResult<T> extends SliceResult<T, Set<T>> {

    protected _initResultsContainer(): Set<T> {
        return new Set();
    }

    public add(item: T): void {
        this._results.add(item);
    }

    public remove(item: T): void {
        this._results.delete(this._getId(item));
    }

}

export class ArrayResult<T> extends SliceResult<T, T[]> {

    private _seenIds: Set<any> = new Set();

    protected _initResultsContainer(): T[] {
        return [];
    }

    public add(item: T): void {

        const id = this._getId(item);

        if (!this._seenIds.has(id)) {
            this._results.push(item);
            this._seenIds.add(id);
        }

    }

    public remove(item: T): void {

        const id = this._getId(item);

        if (this._seenIds.has(id)) {

            let index: number | void = undefined;

            for (let i = 0, len = this._results.length; i < len; i++) {
                if (id === this._getId(this._results[i])) {
                    index = i;
                    break;
                }
            }

            if (typeof index === 'number') {
                this._results.splice(index, 0);
            }

        }


    }

}



// const test = new Tree<{ class: string }, { class: string }[]>({
//     containerType: 'array',
//     idAccessor: (item) => item,
//     aggregators: [{
//         name: 'class',
//         keyAccessor: (item) => item.class
//     }]
// });

// test.slice({
//     conditions: {
//         class: ['in', '123']
//     }
// })
