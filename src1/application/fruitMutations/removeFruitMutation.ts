import {mutationField, stringArg, intArg, booleanArg, nonNull} from 'nexus';
import fruitRepository from "../../infrastructure/repositories/FruitRepository";
import FruitResponse from "../../interfaces/graphql/types/FruitResponse";

// Mutation to remove fruits
const removeFruitMutation = mutationField('removeFruitFromFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        amount: nonNull(intArg())
    },
    resolve: async (_parent, { name, amount }) => {
        const savedFruit = await fruitRepository.removeFruit(name, amount);
        return {
            message: 'Fruit removed successfully.',
            fruit: savedFruit
        };
    },
});

export default removeFruitMutation;