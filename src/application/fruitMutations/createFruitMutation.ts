import { mutationField, nonNull, stringArg, intArg } from 'nexus';
import FruitFactory from '../../domain/factory/fruitFactory';
import FruitResponse  from '../../interfaces/graphql/types/FruitResponse';

const createFruitMutation = mutationField('createFruitForFruitStorage', {
    type: FruitResponse,
    args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
    },
    resolve: async (_parent, { name, description, limitOfFruitToBeStored }) => {
        const fruitFactory = new FruitFactory();
        const savedFruit = await fruitFactory.createFruit(name, description, limitOfFruitToBeStored);
        return {
            message: 'Fruit created successfully.',
            fruit: {
                name: savedFruit.getName(),
                description: savedFruit.getDescription(),
                limitOfFruitToBeStored: savedFruit.getLimit(),
                amount: savedFruit.getAmount()
            }
        };
    },
});

export default createFruitMutation;
