import { INodeConfig } from "../../../lib/node";
import LeafNode from "../../../lib/node/leaf-node";
import ArrayLeaf from "../../../lib/node/leaf-node/array-leaf";

describe('Leaf Node - Array', () => {

    let baseConfig: INodeConfig<any, any>;
    let mockIdAccessor: jest.Mock;
    let testNode: ArrayLeaf<any>;

    beforeEach(() => {
        mockIdAccessor = jest.fn(({ id }) => id);
        baseConfig = {
            parent: undefined,
            containerType: 'array',
            idAccessor: mockIdAccessor,
            key: 'key'
        };
        testNode = new ArrayLeaf({ ...baseConfig });
    });

    it('Should inherit from the leaf node base', () => {
        expect(testNode).toBeInstanceOf(LeafNode);
    });

    it('Should init an array child container', () => {
        expect((testNode as any)._children).toBeInstanceOf(Array);
        expect((testNode as any)._children.length).toBe(0);
    });

    it('Should add items correctly', () => {

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

    });

    it('Should not add duplicate items, based on ID accessor', () => {

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

    });

    it('Should not add the item when the ID accessor throws', () => {

        const node = new ArrayLeaf({
            ...baseConfig,
            idAccessor: ({ id }) => {
                if (id === 'throw') { throw new Error('TEST_ERROR') }
                return id;
            }
        });

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

    });

    it('Should remove items correctly', () => {

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

    });

    it('Should not remove items that aren\'t included', () => {

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

    });

    it('Should process insert/remove streams correctly', () => {

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

    });

    it('Should purge correctly', () => {

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

    });

    it('Should return size information correctly', () => {

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

    });

    it('Should return leaves correctly', () => {

        const item_1 = { id: 'a' };
        const item_2 = { id: 'b' };

        testNode.add(item_1);
        testNode.add(item_2);

        expect(testNode.leaves()).toBeInstanceOf(Array);
        expect(testNode.leaves().length).toBe(2);
        expect(testNode.leaves()).not.toBe(testNode.leaves());
        expect(testNode.leaves()).toEqual(testNode.leaves());

    });

    it('Should allow mutation of `leaves` array without affecting class', () => {

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

    });

});
