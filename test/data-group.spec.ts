import { DataGroup } from '../../_data-aggregator/data-group';

describe('DataGroup', () => {

    it('Should throw if no config is provided', () => {
        expect(() => {
            new DataGroup(undefined as any);
        }).toThrowError(TypeError);
    });

    it('Should throw if the name is not a string.', () => {

        expect(() => {
            new DataGroup({
                name: null,
                keyAccessor: (): string => '',
            });
        }).toThrowError(TypeError);

        expect(() => {
            new DataGroup({
                keyAccessor: (): string => ''
            } as any);
        }).toThrowError(TypeError);

        expect(() => {
            new DataGroup({
                name: 8 as any,
                keyAccessor: (): string => ''
            });
        }).toThrowError(TypeError);

        expect(() => {
            new DataGroup({
                name: ['test'] as any,
                keyAccessor: (): string => ''
            });
        }).toThrowError(TypeError);

    });

    it('Should throw if the key accessor is not a function.', () => {

        expect(() => {
            new DataGroup({
                name: 'test',
                keyAccessor: null
            })
        }).toThrowError(TypeError);

        expect(() => {
            new DataGroup({
                name: 'test',
                keyAccessor: undefined
            })
        });

        expect(() => {
            new DataGroup({
                name: 'test',
                keyAccessor: 'test' as any
            })
        });

        expect(() => {
            new DataGroup({
                name: 'test',
                keyAccessor: [(): any => ''] as any
            })
        });

        expect(() => {
            new DataGroup({
                name: 'test'
            } as any)
        });

    });

    it('Pushing undefined/null should be a no-op', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        expect(dg.size()).toBe(0);
        dg.push(undefined);
        expect(dg.size()).toBe(0);
        dg.push(null);
        expect(dg.size()).toBe(0);

    });

    it('Should push unique items correctly', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        expect(dg.size()).toBe(0);

        dg.push({ id: 'a' });
        expect(dg.size()).toBe(1);

        dg.push({ id: 'b' });
        expect(dg.size()).toBe(2);

        dg.push({ id: 'c' });
        expect(dg.size()).toBe(3);

        dg.push({ id: 'd' });
        expect(dg.size()).toBe(4);

        dg.push({ id: 'e' });
        expect(dg.size()).toBe(5);

    });

    it('Should push duplicate items correctly', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        const dupe = { id: 'a' };

        expect(dg.size()).toBe(0);

        dg.push(dupe);
        expect(dg.size()).toBe(1);

        dg.push(dupe);
        expect(dg.size()).toBe(2);

        dg.push({ id: 'b' });
        expect(dg.size()).toBe(3);

        dg.push({ id: 'c' });
        expect(dg.size()).toBe(4);

        dg.push(dupe);
        expect(dg.size()).toBe(5);

    });

    it('Should should allow adding entries that return multiple strings', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        expect(dg.size()).toBe(0);

        dg.push({ id: ['a', 'b'] });
        expect(dg.size()).toBe(2);

        dg.push({ id: ['b', 'c'] });
        expect(dg.size()).toBe(4);

        dg.push({ id: 'd' });
        expect(dg.size()).toBe(5);

        dg.push({ id: 'a' });
        expect(dg.size()).toBe(6);

    });

    it('Should ignore pushing items that resolve to invalid keys', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        dg.push({ id: 'a' });
        dg.push({ id: 'b' });
        dg.push({ id: 'c' });

        expect(dg.size()).toBe(3);

        dg.push({ id: 5 });
        dg.push({ id: { test: 'abc' } });
        dg.push({ id: true });
        dg.push({ id: [123, 456, 789] });

        expect(dg.size()).toBe(3);

    });

    it('Should ignore non-string entries in key arrays', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        dg.push({ id: ['a', 'b', 'c'] });

        expect(dg.size()).toBe(3);

        dg.push({ id: ['a', true, false, 'b', ['test'], 234] });

        expect(dg.size()).toBe(5);

    });

    it('Should push null key entries', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        dg.push({ id: null });
        dg.push({ id: [null, null] });
        dg.push({ id: ['test', null] });

        expect(dg.size()).toBe(5);

    })

    it('Should purge items correctly', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        expect(dg.size()).toBe(0);

        dg.push({ id: 'a' });
        dg.push({ id: 'b' });
        dg.push({ id: 'c' });

        expect(dg.size()).toBe(3);

        dg.purge();

        expect(dg.size()).toBe(0);

    });

    it('Should add items correctly after purging', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        expect(dg.size()).toBe(0);

        dg.push({ id: 'a' });
        dg.push({ id: 'b' });
        dg.push({ id: 'c' });

        expect(dg.size()).toBe(3);

        dg.purge();

        expect(dg.size()).toBe(0);

        dg.push({ id: 'a' });
        dg.push({ id: 'b' });
        dg.push({ id: 'c' });

        expect(dg.size()).toBe(3);

    });

    it('Should purge an empty group correctly', () => {

        const dg = new DataGroup({
            name: 'test',
            keyAccessor: (item: any): string => item.id
        });

        expect(dg.size()).toBe(0);

        dg.purge();

        expect(dg.size()).toBe(0);

    });

});
