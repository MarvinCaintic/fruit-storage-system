import {mutationField, stringArg, intArg, nonNull} from 'nexus';
import FruitResponse from "../../interfaces/graphql/types/FruitResponse";
import fruitService from "../services/FruitService";

// Mutation to store fruits
const storeFruitMutation = mutationField('storeFruitToFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        amount: nonNull(intArg())
    },
    resolve: async (_parent, { name, amount }) => {
        const savedFruit = await fruitService.storeFruit(name, amount);
        return {
            message: 'Fruit stored successfully.',
            fruit: {
                name: savedFruit?.getName(),
                description: savedFruit?.getDescription(),
                limitOfFruitToBeStored: savedFruit?.getLimit(),
                amount: savedFruit?.getAmount()
            },
        };
    },
});

export default storeFruitMutation;