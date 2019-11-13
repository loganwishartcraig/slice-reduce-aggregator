import Node, { INodeConfig } from "../../../lib/node";
import LeafNode from "../../../lib/node/leaf-node";
import { ContainerType } from "../../../lib/types";

class MockedLeafNode extends LeafNode<any, ContainerType> {

    public add = jest.fn();
    public remove = jest.fn();
    public purge = jest.fn();
    public size = jest.fn();
    public leaves = jest.fn();

    public getChildByKey = jest.fn();
    public hasChild = jest.fn();
    public getAllChildren = jest.fn();
    public getItemChildren = jest.fn();

    protected _initChildren = jest.fn(() => 'container' as any);

}


describe('Leaf Node - Base', () => {

    let baseConfig: INodeConfig<any, any>;
    let mockIdAccessor: jest.Mock;
    let testNode: MockedLeafNode;

    beforeEach(() => {
        mockIdAccessor = jest.fn(({ id }) => id);
        baseConfig = {
            parent: undefined,
            containerType: 'array',
            idAccessor: mockIdAccessor,
            key: 'key'
        };
        testNode = new MockedLeafNode({ ...baseConfig });
    });

    it('Should inherit from the Node base class', () => {
        expect(testNode).toBeInstanceOf(Node);
    });

    it('Should initialize the children container correctly', () => {

        expect((testNode as any)._initChildren).toBeCalledTimes(1);
        expect((testNode as any)._children).toBe('container');

    });

    it('Should return the ID of an item correctly', () => {

        const testItem_1 = { id: 'dummy' };
        const testItem_2 = { id: '' };

        const id_1 = (testNode as any)._getId(testItem_1);

        expect(mockIdAccessor).toBeCalledTimes(1);
        expect(mockIdAccessor).toBeCalledWith(testItem_1);
        expect(id_1).toBe('dummy');

        const id_2 = (testNode as any)._getId(testItem_2);

        expect(mockIdAccessor).toBeCalledTimes(2);
        expect(mockIdAccessor).toBeCalledWith(testItem_2);
        expect(id_2).toBe('');

    });

    it('Should throw if accessing an ID causes the idAccessor function to throw', () => {

        const idAccessor = () => { throw new Error('TEST_ERROR') };
        const dummyNode = new MockedLeafNode({ ...baseConfig, idAccessor });

        expect(() => { (dummyNode as any)._getId() }).toThrow(TypeError);

    });

    it('Should always return `false` for `hasChild()`', () => {

        const testArgs = [
            [undefined],
            [null],
            [123],
            [{ id: 'validId' }],
            [[12], 'three',],
            ['test'],
        ];

        for (const arg in testArgs) {
            expect(testNode.hasChild.apply(testNode, arg)).toBe(false);
        }

    });

    it('Should always return `undefined` for `getChildByKey()`', () => {

        const testArgs = [
            [undefined],
            [null],
            [123],
            [{ id: 'validId' }],
            [[12], 'three',],
            ['test'],
        ];

        for (const arg in testArgs) {
            expect(testNode.getChildByKey.apply(testNode, arg)).toBeUndefined();
        }

    });

    it('Should always return an empty array for `getAllChildren()`', () => {

        const testArgs = [
            [undefined],
            [null],
            [123],
            [{ id: 'validId' }],
            [[12], 'three',],
            ['test'],
        ];

        for (const arg in testArgs) {
            const result = testNode.getChildByKey.apply(testNode, arg);
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(0);
        }

    });

    it('Should always return an empty array for `getItemChildren()`', () => {

        const testArgs = [
            [undefined],
            [null],
            [123],
            [{ id: 'validId' }],
            [[12], 'three',],
            ['test'],
        ];

        for (const arg in testArgs) {
            const result = testNode.getItemChildren.apply(testNode, arg);
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(0);
        }

    });

});
