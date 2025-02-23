import { objectType } from 'nexus';
import Fruit from "./Fruit";

const FruitResponse = objectType({
    name: 'FruitResponse',
    definition(t) {
        t.string('message');
        t.field('fruit', { type: Fruit }); // Add a `fruit` field that returns a `Fruit` object
    },
});

export default FruitResponse;