import {mutationField, stringArg, intArg, nonNull} from 'nexus';
import FruitResponse from "../../interfaces/graphql/types/FruitResponse";
import fruitService from "../services/FruitService";

// Mutation to update fruits
const updateFruitMutation = mutationField('updateFruitForFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        description: stringArg(),
        limitOfFruitToBeStored: intArg(),
    },
    resolve: async (_parent, { name, description, limitOfFruitToBeStored }) => {
        const savedFruit = await fruitService.updateFruit(name, description || null, limitOfFruitToBeStored || null);
        return {
            message: 'Fruit updated successfully.',
            fruit: {
                name: savedFruit?.getName(),
                description: savedFruit?.getDescription(),
                limitOfFruitToBeStored: savedFruit?.getLimit(),
                amount: savedFruit?.getAmount()
            },
        };
    },
});

export default updateFruitMutation;