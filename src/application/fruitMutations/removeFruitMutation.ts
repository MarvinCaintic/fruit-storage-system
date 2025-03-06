import {mutationField, stringArg, intArg, nonNull} from 'nexus';
import FruitResponse from "../../interfaces/graphql/types/FruitResponse";
import fruitService from "../services/FruitService";

// Mutation to remove fruits
const removeFruitMutation = mutationField('removeFruitFromFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        amount: nonNull(intArg())
    },
    resolve: async (_parent, { name, amount }) => {
        const savedFruit = await fruitService.removeFruit(name, amount);

        return {
            message: 'Fruit removed successfully.',
            fruit: {
                name: savedFruit?.getName(),
                description: savedFruit?.getDescription(),
                limitOfFruitToBeStored: savedFruit?.getLimit(),
                amount: savedFruit?.getAmount()
            },
        };
    },
});

export default removeFruitMutation;