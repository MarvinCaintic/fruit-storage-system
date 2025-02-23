import { mutationField, nonNull, stringArg, intArg } from 'nexus';
import fruitFactory from '../../domain/factory/fruitFactory';
import FruitResponse  from '../../interfaces/graphql/types/FruitResponse';
import fruitService from "../services/FruitService";

const createFruitMutation = mutationField('createFruitForFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
    },
    resolve: async (_parent, { name, description, limitOfFruitToBeStored }) => {
        const fruit = fruitFactory.createFruit(name, description, limitOfFruitToBeStored);
        const savedFruit = await fruitService.createFruit(fruit.getName(), fruit.getDescription(), fruit.getLimit(), fruit.getAmount());

        return {
            message: 'Fruit created successfully.',
            fruit: savedFruit,
        };
    },
});

export default createFruitMutation;
