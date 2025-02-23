import fruitRepository from "../../infrastructure/repositories/FruitRepository";
import FruitEntity from "../../domain/entities/FruitEntity";
import eventEmitter from "../../utils/eventEmmiter";

class FruitService {
    async createFruit(name: string, description: string, limit: number, amount: number = 0): Promise<FruitEntity> {
        // Ensure the fruit name is unique
        const existingFruit = await fruitRepository.findByName(name);
        if (existingFruit) {
            throw new Error(`A fruit with the name '${name}' already exists.`);
        }

        // Create domain entity (validations inside entity)
        const fruit = FruitEntity.createFruit(name, description, limit, amount);

        // Persist the fruit
        await fruitRepository.save(fruit);

        // Emit an event for domain changes
        eventEmitter.emit("fruitCreated", fruit);

        return fruit;
    }

    async updateFruit(name: string, newDescription: string | null, newLimit: number | null): Promise<FruitEntity | null> {
        const fruit = await fruitRepository.findByName(name);
        if (!fruit) {
            throw new Error(`Fruit with name '${name}' not found.`);
        }

        fruit.update(newDescription, newLimit);
        const updatedFruit = await fruitRepository.updateFruit(fruit);

        eventEmitter.emit("fruitUpdated", updatedFruit);

        return updatedFruit;
    }

    async storeFruit(name: string, amountToStore: number): Promise<FruitEntity | null> {
        const fruit = await fruitRepository.findByName(name);
        if (!fruit) {
            throw new Error(`Fruit with name '${name}' not found.`);
        }

        fruit.store(amountToStore);
        const updatedFruit = await fruitRepository.updateFruit(fruit);

        eventEmitter.emit("fruitStored", updatedFruit);

        return updatedFruit;
    }

    async removeFruit(name: string, amountToRemove: number): Promise<FruitEntity | null> {
        const fruit = await fruitRepository.findByName(name);
        if (!fruit) {
            throw new Error(`Fruit with name '${name}' not found.`);
        }

        fruit.remove(amountToRemove);
        const updatedFruit = await fruitRepository.updateFruit(fruit);

        eventEmitter.emit("fruitRemoved", updatedFruit);

        return updatedFruit;
    }

    async deleteFruit(name: string, forceDelete: boolean): Promise<void> {
        const fruit = await fruitRepository.findByName(name);
        if (!fruit) {
            throw new Error(`Fruit with name '${name}' not found.`);
        }

        if (!forceDelete && fruit.hasStoredAmount()) {
            throw new Error("Cannot delete fruit with existing storage.");
        }

        await fruitRepository.delete(name);
        eventEmitter.emit("fruitDeleted", name);
    }

    async findByName(name: string): Promise<FruitEntity | null> {
        const fruit = await fruitRepository.findByName(name);
        if (!fruit) throw new Error('Fruit not found.');
        return fruit;
    }
}

const fruitService = new FruitService();
export default fruitService;
