import { makeSchema } from 'nexus';
import Fruit from './types/Fruit'
import FruitMutations from './mutations/fruitMutations'
import FruitQueries from './queries/fruitQueries';
import path from 'path';

// Create the schema
const schema = makeSchema({
    types: [{...Fruit}, {...FruitMutations}, {...FruitQueries}],
    outputs: {
        schema: path.resolve(__dirname, '../../../generated/schema.graphql'),
        typegen: path.resolve(__dirname, '../generated/nexus.ts'),
    },
});

export default schema;
