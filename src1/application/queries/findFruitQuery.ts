import {nonNull, queryField, stringArg} from 'nexus';
import fruitRepository from "../../infrastructure/repositories/FruitRepository";

// Query to find a fruit by name
const findFruitQuery = queryField('findFruit', {
    type: 'Fruit',
    args: {
        name: nonNull(stringArg()),
    },
    resolve: async (_parent, { name }) => {
        const fruit = await fruitRepository.findByName(name);
        if (!fruit) throw new Error('Fruit not found.');
        return fruit;
    },
});

export default findFruitQuery;