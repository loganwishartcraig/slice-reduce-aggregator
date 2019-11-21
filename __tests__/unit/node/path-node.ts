import PathNode, { IPathNodeConfig } from "../../../lib/node/path-node";
import Node from "../../../lib/node";

interface TestData {
    root: string;
    edge: string;
    middle: string;
    dummy: string;
}

describe('Path Node', () => {

    let testData: TestData[];

    let keyAccessor_root: jest.Mock;
    let keyAccessor_edge: jest.Mock;
    let keyAccessor_middle: jest.Mock;
    let keyAccessor_dummy: jest.Mock;

    let edgePathNode: PathNode<any, any>;
    let middlePathNode: PathNode<any, any>;
    let rootPathNode: PathNode<any, any>;
    let dummyParentNode: PathNode<any, any>;

    let testNodes: PathNode<any, any>[];

    beforeEach(() => {

        testData = [
            { dummy: 'd_1', edge: 'e_1', middle: 'm_1', root: 'r_1' },
            { dummy: 'd_2', edge: 'e_2', middle: 'm_2', root: 'r_2' },
            { dummy: 'd_3', edge: 'e_3', middle: 'm_3', root: 'r_3' },
            { dummy: 'd_4', edge: 'e_4', middle: 'm_4', root: 'r_4' },
        ];

        keyAccessor_root = jest.fn(({ root }) => root);
        keyAccessor_edge = jest.fn(({ edge }) => edge);
        keyAccessor_middle = jest.fn(({ middle }) => middle)
        keyAccessor_dummy = jest.fn(({ dummy }) => dummy)

        dummyParentNode = new PathNode({
            aggregator: {
                name: 'dummy_parent_agg',
                keyAccessor: keyAccessor_dummy,
            },
            nextAggregators: [],
            containerType: 'array',
            idAccessor: jest.fn(({ id }) => id),
            key: 'dummy',
            parent: undefined
        });

        edgePathNode = new PathNode({
            aggregator: {
                name: 'edge_agg',
                keyAccessor: keyAccessor_edge,
            },
            nextAggregators: [],
            containerType: 'array',
            idAccessor: jest.fn(({ id }) => id),
            key: 'edge',
            parent: dummyParentNode
        });

        middlePathNode = new PathNode({
            aggregator: {
                name: 'middle_agg',
                keyAccessor: keyAccessor_middle
            },
            nextAggregators: [{
                name: 'dummy_agg',
                keyAccessor: jest.fn(({ dummy }) => dummy)
            }],
            containerType: 'array',
            idAccessor: jest.fn(({ id }) => id),
            key: 'middle',
            parent: dummyParentNode
        });

        rootPathNode = new PathNode({
            aggregator: {
                name: 'root_agg',
                keyAccessor: keyAccessor_root
            },
            nextAggregators: [{
                name: 'dummy_agg',
                keyAccessor: jest.fn(({ dummy }) => dummy)
            }],
            containerType: 'array',
            idAccessor: jest.fn(({ id }) => id),
            key: 'root',
            parent: undefined
        });

        testNodes = [
            rootPathNode,
            middlePathNode,
            edgePathNode,
        ];

    });

    it('Should throw if an invalid aggregator is provided.', () => {

        const baseConfig: Omit<IPathNodeConfig<any, any>, 'aggregator'> = {
            nextAggregators: [],
            containerType: 'array',
            idAccessor: jest.fn(({ id }) => id),
            key: 'root_node',
            parent: undefined
        };

        expect(() => {
            new PathNode({
                ...baseConfig
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {},
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: true,
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {
                    name: 123,
                    aggregator: ({ test }) => test
                },
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {
                    aggregator: ({ test }) => test
                },
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {
                    name: undefined,
                    aggregator: ({ test }) => test
                },
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {
                    name: null,
                    aggregator: ({ test }) => test
                },
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {
                    aggregator: 123,
                    name: 'test'
                },
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {
                    name: 'test'
                },
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {
                    aggregator: undefined,
                    name: 'test'
                },
            } as any)
        }).toThrow(TypeError);

        expect(() => {
            new PathNode({
                ...baseConfig,
                aggregator: {
                    aggregator: null,
                    name: 'test'
                },
            } as any)
        }).toThrow(TypeError);

    });

    it('Should be an instance of Node', () => {
        for (const node of testNodes) {
            expect(node).toBeInstanceOf(Node);
        }
    });

    it('Should insert new items', () => {

        for (const testNode of testNodes) {

            for (const data of testData) {
                testNode.add(data);
            }

            for (const data of testData) {
                expect(testNode.getChildByKey(data[testNode.key])).toBeInstanceOf(Node);
                expect(testNode.size()).toBe(4);
            }

        }

    });

})
