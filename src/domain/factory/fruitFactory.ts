import FruitEntity from "../entities/FruitEntity";
import fruitRepository from "../../infrastructure/repositories/FruitRepository";

class FruitFactory {
    createFruit(name: string, description: string, limitOfFruitToBeStored: number): FruitEntity {
        if (!name || !description || limitOfFruitToBeStored <= 0) {
            throw new Error('Invalid fruit data.');
        }

        return {
            name,
            description,
            limitOfFruitToBeStored,
            amount: 0
        } as FruitEntity;
    }
}

const fruitFactory = new FruitFactory();
export default fruitFactory;