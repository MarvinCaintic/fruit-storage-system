import {mutationField, stringArg, intArg, booleanArg, nonNull} from 'nexus';
import fruitRepository from "../../infrastructure/repositories/FruitRepository";
import FruitResponse from "../../interfaces/graphql/types/FruitResponse";

// Mutation to store fruits
const storeFruitMutation = mutationField('storeFruitToFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        amount: nonNull(intArg())
    },
    resolve: async (_parent, { name, amount }) => {
        const savedFruit = await fruitRepository.storeFruit(name, amount);
        return {
            message: 'Fruit stored successfully.',
            fruit: savedFruit
        };
    },
});

export default storeFruitMutation;