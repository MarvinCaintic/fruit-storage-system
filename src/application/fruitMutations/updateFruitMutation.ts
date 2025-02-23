import {mutationField, stringArg, intArg, booleanArg, nonNull} from 'nexus';
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
        const savedFruit = await fruitService.updateFruit(name, description, limitOfFruitToBeStored);
        return {
            message: 'Fruit updated successfully.',
            fruit: savedFruit
        };
    },
});

export default updateFruitMutation;