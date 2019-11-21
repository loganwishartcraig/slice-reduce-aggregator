import { INodeConfig } from "../../../lib/node";
import LeafNode, { MapLeaf, SetLeaf } from "../../../lib/node/leaf-node";
import ArrayLeaf from "../../../lib/node/leaf-node/array-leaf";

describe('Leaf Node - Concrete', () => {

    let baseConfig;
    let mockIdAccessor: jest.Mock;
    // let testNode: ArrayLeaf<any>;

    let arrayNode: ArrayLeaf<any>;
    let mapNode: MapLeaf<any>;
    let setNode: SetLeaf<any>;

    let testNodes: LeafNode<any, any>[];

    let genNodes = (configOverride: Partial<INodeConfig<any, any>> = {}) => ([
        new ArrayLeaf({ ...baseConfig, containerType: 'array' }),
        new MapLeaf({ ...baseConfig, containerType: 'map' }),
        new SetLeaf({ ...baseConfig, containerType: 'set' }),
    ] as const);

    beforeEach(() => {

        mockIdAccessor = jest.fn(({ id }) => id);
        baseConfig = {
            parent: undefined,
            idAccessor: mockIdAccessor,
            key: 'key'
        };

        arrayNode = new ArrayLeaf({ ...baseConfig, containerType: 'array' });
        mapNode = new MapLeaf({ ...baseConfig, containerType: 'map' });
        setNode = new SetLeaf({ ...baseConfig, containerType: 'set' });

        testNodes = [
            arrayNode,
            mapNode,
            setNode,
        ];

    });

    it('Should inherit from the leaf node base', () => {

        for (const testNode of testNodes) {
            expect(testNode).toBeInstanceOf(LeafNode);
        }

    });

    it('Array node should init an array child container', () => {
        expect((arrayNode as any)._children).toBeInstanceOf(Array);
        expect((arrayNode as any)._children.length).toBe(0);
    });

    it('Map node should init an array child container', () => {
        expect((mapNode as any)._children).toBeInstanceOf(Map);
        expect((mapNode as any)._children.size).toBe(0);
    });

    it('Set node should init an array child container', () => {
        expect((setNode as any)._children).toBeInstanceOf(Set);
        expect((setNode as any)._children.size).toBe(0);
    });

    it('Should add items correctly', () => {

        for (const testNode of testNodes) {

            const item_1 = { id: 'a' };
            const item_2 = { id: 'b' };
            const item_3 = { id: 'c' };

            testNode.add(item_1);
            testNode.add(item_2);
            testNode.add(item_3);

            const leaves = testNode.leaves();

            expect(leaves.length).toBe(3);
            expect(leaves.includes(item_1)).toBe(true);
            expect(leaves.includes(item_2)).toBe(true);
            expect(leaves.includes(item_3)).toBe(true);

        }

    });

    it('Should not add duplicate items, based on ID accessor', () => {

        for (const testNode of testNodes) {

            const item_1 = { id: 'a' };
            const item_2 = { id: 'a' };
            const item_3 = { id: 'b' };

            testNode.add(item_1);
            expect(testNode.leaves().length).toBe(1);

            testNode.add(item_1);
            expect(testNode.leaves().length).toBe(1);

            testNode.add(item_2);
            expect(testNode.leaves().length).toBe(1);

            testNode.add(item_1);
            expect(testNode.leaves().length).toBe(1);

            testNode.add(item_2);
            expect(testNode.leaves().length).toBe(1);

            testNode.add(item_2);
            expect(testNode.leaves().length).toBe(1);

            testNode.add(item_3);
            expect(testNode.leaves().length).toBe(2);

            testNode.add(item_3);
            expect(testNode.leaves().length).toBe(2);

            testNode.add(item_2);
            expect(testNode.leaves().length).toBe(2);

            testNode.add(item_2);
            expect(testNode.leaves().length).toBe(2);

            testNode.add(item_3);
            expect(testNode.leaves().length).toBe(2);

        }

    });

    it('Should not add the item when the ID accessor throws', () => {

        const nodes = genNodes({
            idAccessor: ({ id }) => {
                if (id === 'throw') { throw new Error('TEST_ERROR') }
                return id;
            }
        });

        for (const node of nodes) {

            expect(() => { node.add({ id: 'throw' }) }).toThrow();
            expect(node.leaves().length).toBe(0);

            node.add({ id: 'test_1' });
            expect(node.leaves().length).toBe(1);

            expect(() => { node.add({ id: 'throw' }) }).toThrow();
            expect(node.leaves().length).toBe(1);

            node.add({ id: 'test_2' });
            expect(node.leaves().length).toBe(2);

            expect(() => { node.add({ id: 'throw' }) }).toThrow();
            expect(node.leaves().length).toBe(2);

        }

    });

    it('Should remove items correctly', () => {

        for (const testNode of testNodes) {

            const item_1 = { id: 'a' };
            const item_2 = { id: 'b' };
            const item_3 = { id: 'c' };

            testNode.add(item_1);
            testNode.add(item_2);
            testNode.add(item_3);

            expect(testNode.leaves().length).toBe(3);

            testNode.remove(item_1);

            expect(testNode.leaves().length).toBe(2);
            expect(testNode.leaves().includes(item_1)).toBe(false);

            testNode.remove(item_2);

            expect(testNode.leaves().length).toBe(1);
            expect(testNode.leaves().includes(item_2)).toBe(false);

            testNode.remove(item_3);

            expect(testNode.leaves().length).toBe(0);
            expect(testNode.leaves().includes(item_3)).toBe(false);
        }

    });

    it('Should not remove items that aren\'t included', () => {

        for (const testNode of testNodes) {

            const item_1 = { id: 'a' };
            const item_2 = { id: 'b' };
            const item_3 = { id: 'c' };
            const not_inserted = { id: 'd' };

            testNode.add(item_1);
            testNode.add(item_2);
            testNode.add(item_3);

            expect(testNode.leaves().length).toBe(3);

            testNode.remove(item_1);

            expect(testNode.leaves().length).toBe(2);
            expect(testNode.leaves().includes(item_1)).toBe(false);

            testNode.remove(item_1);

            expect(testNode.leaves().length).toBe(2);
            expect(testNode.leaves().includes(item_1)).toBe(false);

            testNode.remove(not_inserted);

            expect(testNode.leaves().length).toBe(2);
            expect(testNode.leaves().includes(not_inserted)).toBe(false);

        }

    });

    it('Should process insert/remove streams correctly', () => {

        for (const testNode of testNodes) {

            const item_1 = { id: 'a' };
            const item_2 = { id: 'b' };

            expect(testNode.leaves().length).toBe(0);

            testNode.add(item_1);
            expect(testNode.leaves().includes(item_1)).toBe(true);
            expect(testNode.leaves().length).toBe(1);

            testNode.remove(item_1);
            expect(testNode.leaves().includes(item_1)).toBe(false);
            expect(testNode.leaves().length).toBe(0);

            testNode.remove(item_1);
            expect(testNode.leaves().includes(item_1)).toBe(false);
            expect(testNode.leaves().length).toBe(0);

            testNode.add(item_1);
            testNode.add(item_2);
            expect(testNode.leaves().includes(item_1)).toBe(true);
            expect(testNode.leaves().includes(item_2)).toBe(true);
            expect(testNode.leaves().length).toBe(2);

            testNode.add(item_1);
            testNode.add(item_2);
            expect(testNode.leaves().includes(item_1)).toBe(true);
            expect(testNode.leaves().includes(item_2)).toBe(true);
            expect(testNode.leaves().length).toBe(2);

            testNode.remove(item_1);
            expect(testNode.leaves().includes(item_1)).toBe(false);
            expect(testNode.leaves().includes(item_2)).toBe(true);
            expect(testNode.leaves().length).toBe(1);

            testNode.remove(item_2);
            expect(testNode.leaves().includes(item_1)).toBe(false);
            expect(testNode.leaves().includes(item_2)).toBe(false);
            expect(testNode.leaves().length).toBe(0);

            testNode.remove(item_2);
            expect(testNode.leaves().includes(item_1)).toBe(false);
            expect(testNode.leaves().includes(item_2)).toBe(false);
            expect(testNode.leaves().length).toBe(0);

            testNode.remove(item_1);
            expect(testNode.leaves().includes(item_1)).toBe(true);
            expect(testNode.leaves().includes(item_2)).toBe(false);
            expect(testNode.leaves().length).toBe(1);

        }

    });

    it('Should purge correctly', () => {

        for (const testNode of testNodes) {

            expect(testNode.leaves().length).toBe(0);

            testNode.purge();
            expect(testNode.leaves().length).toBe(0);

            const item_1 = { id: 'a' };
            const item_2 = { id: 'b' };

            testNode.add(item_1);
            testNode.add(item_2);
            expect(testNode.leaves().length).toBe(2);

            testNode.purge();
            expect(testNode.leaves().length).toBe(0);
            expect(testNode.leaves().includes(item_1)).toBe(false);
            expect(testNode.leaves().includes(item_2)).toBe(false);

            testNode.purge();
            expect(testNode.leaves().length).toBe(0);

            testNode.add(item_1);
            testNode.purge();
            expect(testNode.leaves().length).toBe(0);
            expect(testNode.leaves().includes(item_1)).toBe(false);

        }

    });

    it('Should return size information correctly', () => {

        for (const testNode of testNodes) {

            expect(testNode.size()).toBe(0);

            const item_1 = { id: 'a' };
            const item_2 = { id: 'b' };

            testNode.add(item_1);
            testNode.add(item_2);
            expect(testNode.size()).toBe(2);

            testNode.remove(item_1);
            expect(testNode.size()).toBe(1);

            testNode.remove(item_2);
            expect(testNode.size()).toBe(0);

            testNode.remove(item_2);
            expect(testNode.size()).toBe(0);

            testNode.purge();
            expect(testNode.size()).toBe(0);

            testNode.add(item_1);
            testNode.add(item_2);
            expect(testNode.size()).toBe(2);

            testNode.purge();
            expect(testNode.size()).toBe(0);

        }

    });

    it('Should return leaves correctly', () => {

        for (const testNode of testNodes) {

            const item_1 = { id: 'a' };
            const item_2 = { id: 'b' };

            testNode.add(item_1);
            testNode.add(item_2);

            expect(testNode.leaves()).toBeInstanceOf(Array);
            expect(testNode.leaves().length).toBe(2);
            expect(testNode.leaves()).not.toBe(testNode.leaves());
            expect(testNode.leaves()).toEqual(testNode.leaves());

        }

    });

    it('Should allow mutation of `leaves` array without affecting class', () => {

        for (const testNode of testNodes) {

            const item_1 = { id: 'a' };
            const item_2 = { id: 'b' };
            const not_inserted = { id: 'c' };

            testNode.add(item_1);
            testNode.add(item_2);

            const leaves = testNode.leaves();

            leaves.push(not_inserted);

            expect(testNode.leaves().length).toBe(2);
            expect(testNode.leaves().includes(not_inserted)).toBe(false);
            expect(testNode.leaves()).not.toBe(leaves);
            expect(testNode.leaves()).not.toEqual(leaves);

        }

    });

});
