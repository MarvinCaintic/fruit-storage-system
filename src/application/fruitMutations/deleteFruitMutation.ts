import {mutationField, stringArg, booleanArg, nonNull} from 'nexus';
import fruitService from "../services/FruitService";

// Mutation to delete fruits
const deleteFruitMutation = mutationField('deleteFruitFromFruitStorage', {
    type: 'String',
    args: {
        name: nonNull(stringArg()),
        forceDelete: booleanArg()
    },
    resolve: async (_parent, { name, forceDelete }) => {
        await fruitService.deleteFruit(name, !!forceDelete)
        return 'Fruit deleted successfully.';
    },
});

export default deleteFruitMutation;