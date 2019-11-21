import { ContainerType } from "../../../lib/types";
import Node, { INodeConfig } from "../../../lib/node";

class MockedNode<C extends ContainerType, T = any> extends Node<T, ContainerType> {

    public add = jest.fn();
    public remove = jest.fn();
    public purge = jest.fn();
    public size = jest.fn();
    public leaves = jest.fn();

    public getChildByKey = jest.fn();
    public hasChild = jest.fn();
    public getAllChildren = jest.fn();
    public getItemChildren = jest.fn();

}


describe('Node - Base', () => {

    let baseConfig: INodeConfig<any, any>;

    beforeEach(() => {
        baseConfig = {
            parent: undefined,
            containerType: 'array',
            idAccessor: ({ id }) => id,
            key: 'key'
        };
    });

    it('Should throw an error if the key is invalid.', () => {

        expect((() => {
            new MockedNode({
                ...baseConfig,
                key: undefined as any
            });
        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                key: null as any
            });
        })).toThrow(TypeError);

        expect((() => {

            const newConfig = { ...baseConfig };
            delete newConfig.key;

            new MockedNode(newConfig);

        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                key: 1 as any,
            });
        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                key: ['a string'] as any,
            });
        })).toThrow(TypeError);

    });

    it('Should throw an error if the containerType is invalid', () => {

        expect((() => {
            new MockedNode({
                ...baseConfig,
                containerType: undefined as any
            });
        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                containerType: null as any
            });
        })).toThrow(TypeError);

        expect((() => {

            const newConfig = { ...baseConfig };
            delete newConfig.containerType;

            new MockedNode(newConfig);

        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                containerType: 1 as any,
            });
        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                containerType: ['a string'] as any,
            });
        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                containerType: 'invalidContainerType' as any,
            });
        })).toThrow(TypeError);

    });

    it('Should throw an error if the idAccessor is invalid', () => {

        expect((() => {
            new MockedNode({
                ...baseConfig,
                idAccessor: undefined as any
            });
        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                idAccessor: null as any
            });
        })).toThrow(TypeError);

        expect((() => {

            const newConfig = { ...baseConfig };
            delete newConfig.idAccessor;

            new MockedNode(newConfig);

        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                idAccessor: 1 as any,
            });
        })).toThrow(TypeError);

        expect((() => {
            new MockedNode({
                ...baseConfig,
                idAccessor: ['a string'] as any,
            });
        })).toThrow(TypeError);

    });


    it('Should throw an error if the parent is invalid', () => {

        expect(() => {
            new MockedNode({
                ...baseConfig,
                parent: [123] as any
            });
        }).toThrow(TypeError);

        expect(() => {
            new MockedNode({
                ...baseConfig,
                parent: "a string" as any
            });
        }).toThrow(TypeError);

    });

    it('Should throw an error if no config is provided', () => {

        expect(() => {
            new MockedNode(undefined as any);
        }).toThrow(TypeError);

        expect(() => {
            new MockedNode(null as any);
        }).toThrow(TypeError);

    });


    it('Should instantiate correctly with the config provided', () => {

        const test = new MockedNode({
            ...baseConfig
        });

        expect(test).toBeTruthy();
        expect(test.key).toBe(baseConfig.key);
        expect(test.parent).toBe(baseConfig.parent);

    });

    it('Should instantiate correctly with a parent provided', () => {

        const parent = new MockedNode({ ...baseConfig });

        const test = new MockedNode({
            ...baseConfig,
            parent
        });

        expect(test).toBeTruthy();
        expect(test.parent).toBe(parent);

    });

    it('Should lock key/parent fields for editing', () => {

        const parent = new MockedNode({ ...baseConfig });

        const test = new MockedNode({
            ...baseConfig,
            parent
        });

        expect(() => {
            (test as any).key = 'overwrite';
        }).toThrow();

        expect(() => {
            (test as any).parent = undefined;
        }).toThrow();

    });

})
