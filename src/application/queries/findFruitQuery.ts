import {nonNull, queryField, stringArg} from 'nexus';
import fruitRepository from "../../infrastructure/repositories/FruitRepository";
import fruitService from "../services/FruitService";

// Query to find a fruit by name
const findFruitQuery = queryField('findFruit', {
    type: 'Fruit',
    args: {
        name: nonNull(stringArg()),
    },
    resolve: async (_parent, { name }) => {
        return await fruitService.findByName(name)
    },
});

export default findFruitQuery;