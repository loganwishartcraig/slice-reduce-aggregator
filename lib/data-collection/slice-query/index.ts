import { ContainerType } from "../types";
import SliceResult, { SliceResultFactory } from "../slice-result";
import Tree from "../subset-tree";
import Node from "../node";
import { VoidKey } from "../constants";

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



export interface ISliceQueryConfig extends IQueryConfig {
    id: number;
}

export default class SliceQuery<T, C extends ContainerType> {

    private _query: IQueryConfig;
    private _result: SliceResult<T, C>;
    private _tree: Tree<T, C>;

    public readonly id: number;

    private _executed: boolean = false;

    constructor(config: ISliceQueryConfig, tree: Tree<T, C>) {
        this._query = config;
        this._tree = tree;
        this.id = config.id;
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
                return [currentNode.getChildByKey(VoidKey)]
                    .filter(item => !!item) as Node<T, C>[];
            default:
                console.error(`Unknown slice operator ${operator} for aggregation ${currentAggregationKey}`);
                return [];

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
                return this._result;
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
                return key === VoidKey;
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
