import FruitEntity from "../entities/FruitEntity";

class FruitFactory {
    createFruit(name: string, description: string, limitOfFruitToBeStored: number): FruitEntity {
        return FruitEntity.createFruit(name, description, limitOfFruitToBeStored);
    }
}

const fruitFactory = new FruitFactory();
export default fruitFactory;