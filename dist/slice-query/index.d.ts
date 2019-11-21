import Node from "../node";
import SliceResult from "../slice-result";
import SubsetTree from "../subset-tree";
import { ContainerType } from "../types";
export interface BaseCondition extends Array<any> {
    0: 'eq' | 'ne' | 'in' | 'out' | 'any' | 'null';
    1?: string | string[] | true;
}
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
export declare type QueryCondition = EqualityCondition | NonEqualityCondition | InCondition | OutCondition | AnyCondition | NullCondition;
export interface IQueryConfig {
    conditions: {
        [aggName: string]: QueryCondition;
    };
    cache?: boolean;
}
export interface ISliceQueryConfig extends IQueryConfig {
    id: number;
}
export declare abstract class TreeQuery<T, C extends ContainerType> {
    readonly id: number;
    protected _query: IQueryConfig;
    protected _result: any;
    protected _tree: SubsetTree<T, C>;
    protected _executed: boolean;
    constructor(config: ISliceQueryConfig, tree: SubsetTree<T, C>);
    abstract exec(): any;
    protected abstract _initResults(): any;
    protected _resolveNextBFSNodes({ currentNode, condition: [operator, value], currentAggregationKey }: {
        currentNode: Node<T, C>;
        condition: QueryCondition;
        currentAggregationKey: string;
    }): Node<T, C>[];
    append(item: T): SliceResult<T, C>;
    private _keyMatchesConditionValue;
    remove(item: T): SliceResult<T, C>;
}
export default class SliceQuery<T, C extends ContainerType> extends TreeQuery<T, C> {
    protected _initResults(): SliceResult<T, C>;
    exec(): SliceResult<T, C>;
}
