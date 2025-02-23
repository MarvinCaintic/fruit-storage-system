import {mutationField, stringArg, intArg, booleanArg, nonNull} from 'nexus';
import fruitRepository from "../../infrastructure/repositories/FruitRepository";
import FruitResponse from "../../interfaces/graphql/types/FruitResponse";

// Mutation to update fruits
const updateFruitMutation = mutationField('updateFruitForFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        description: stringArg(),
        limitOfFruitToBeStored: intArg(),
    },
    resolve: async (_parent, { name, description, limitOfFruitToBeStored }) => {
        const savedFruit = await fruitRepository.updateFruit(name, description, limitOfFruitToBeStored);
        return {
            message: 'Fruit updated successfully.',
            fruit: savedFruit
        };
    },
});

export default updateFruitMutation;