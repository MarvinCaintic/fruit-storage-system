import {nonNull, queryField, stringArg} from 'nexus';
import fruitService from "../services/FruitService";

// Query to find a fruit by name
const findFruitQuery = queryField('findFruit', {
    type: 'Fruit',
    args: {
        name: nonNull(stringArg()),
    },
    resolve: async (_parent, { name }) => {
        const fruit = await fruitService.findFruit(name)
        return {
            name: fruit?.getName(),
            description: fruit?.getDescription(),
            limitOfFruitToBeStored: fruit?.getLimit(),
            amount: fruit?.getAmount()
        }
    },
});

export default findFruitQuery;