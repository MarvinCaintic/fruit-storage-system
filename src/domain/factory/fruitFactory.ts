import FruitEntity from "../entities/FruitEntity";
import fruitService from "../../application/services/FruitService";

class FruitFactory {
    async createFruit(name: string, description: string, limitOfFruitToBeStored: number): Promise<FruitEntity> {
        return await fruitService.createFruit(name, description, limitOfFruitToBeStored);
    }
}

const fruitFactory = new FruitFactory();
export default fruitFactory;