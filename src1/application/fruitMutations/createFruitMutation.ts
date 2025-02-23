import { mutationField, nonNull, stringArg, intArg } from 'nexus';
import fruitFactory from '../../domain/factory/fruitFactory';
import fruitRepository from '../../infrastructure/repositories/FruitRepository';
import FruitResponse  from '../../interfaces/graphql/types/FruitResponse';

const createFruitMutation = mutationField('createFruitForFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
    },
    resolve: async (_parent, { name, description, limitOfFruitToBeStored }) => {
        const fruit = fruitFactory.createFruit(name, description, limitOfFruitToBeStored);
        const savedFruit = await fruitRepository.save(fruit);

        return {
            message: 'Fruit created successfully.',
            fruit: savedFruit,
        };
    },
});

export default createFruitMutation;
