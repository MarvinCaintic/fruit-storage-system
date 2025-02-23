import { objectType } from 'nexus';

const Fruit = objectType({
    name: 'Fruit',
    definition(t) {
        t.string('name');
        t.string('description');
        t.int('limitOfFruitToBeStored');
        t.int('amount');
    },
});

export default Fruit;
