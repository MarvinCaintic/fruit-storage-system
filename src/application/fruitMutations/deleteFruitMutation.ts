import {mutationField, stringArg, intArg, booleanArg, nonNull} from 'nexus';
import fruitRepository from "../../infrastructure/repositories/FruitRepository";

// Mutation to delete fruits
const deleteFruitMutation = mutationField('deleteFruitFromFruitStorage', {
    type: 'String',
    args: {
        name: nonNull(stringArg()),
        forceDelete: booleanArg()
    },
    resolve: async (_parent, { name, forceDelete= false }) => {
        await fruitRepository.delete(name, forceDelete);
        return 'Fruit deleted successfully.';
    },
});

export default deleteFruitMutation;