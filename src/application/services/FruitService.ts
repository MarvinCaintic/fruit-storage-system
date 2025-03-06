import mongoose from "mongoose";
import fruitRepository from "../../infrastructure/repositories/FruitRepository";
import FruitEntity from "../../domain/entities/FruitEntity";
import eventEmitter from "../../shared/utils/eventEmitter";
import {
    FruitCreatedEvent,
    FruitUpdatedEvent,
    FruitDeletedEvent
} from "../../domain/events/index";

class FruitService {

    async createFruit(name: string, description: string, limit: number, amount: number = 0): Promise<FruitEntity> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const existingFruit = await fruitRepository.findByName(name);
            if (existingFruit) {
                throw new Error(`A fruit with the name '${name}' already exists.`);
            }

            const fruit = await FruitEntity.createFruit(name, description, limit, amount);

            // 🛠️ Use session when saving
            await fruitRepository.save(fruit);

            // Emit the event
            const event = new FruitCreatedEvent(fruit);
            eventEmitter.emit("fruitCreated", event);

            await session.commitTransaction();
            console.log("✅ Transaction committed successfully.");

            return fruit;
        } catch (error) {
            await session.abortTransaction();
            console.log("🔁 Transaction rolled back.");

            throw error;
        } finally {
            await session.endSession();
        }
    }

    async updateFruit(name: string, newDescription: string | null, newLimit: number | null): Promise<FruitEntity | null> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const fruit = await fruitRepository.findByName(name);
            if (!fruit) {
                throw new Error(`Fruit with name '${name}' not found.`);
            }

            fruit.update(newDescription, newLimit);

            const updatedFruit = await fruitRepository.updateFruit(fruit);

            if (updatedFruit) {
                const event = new FruitUpdatedEvent(updatedFruit);
                eventEmitter.emit("fruitUpdated", event);
            } else {
                throw new Error(`Updated fruit is null.`);
            }

            await session.commitTransaction();
            console.log("✅ Transaction committed successfully.");

            return updatedFruit;
        } catch (error) {
            await session.abortTransaction();
            console.log("🔁 Transaction rolled back.");

            throw error;
        } finally {
            await session.endSession();
        }
    }

    async storeFruit(name: string, amountToStore: number): Promise<FruitEntity | null> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const fruit = await fruitRepository.findByName(name);
            if (!fruit) {
                throw new Error(`Fruit with name '${name}' not found.`);
            }

            fruit.store(amountToStore);

            const updatedFruit = await fruitRepository.updateFruit(fruit);

            if (updatedFruit) {
                const event = new FruitUpdatedEvent(updatedFruit);
                eventEmitter.emit("fruitUpdated", event);
            } else {
                throw new Error(`Updated fruit is null.`);
            }

            await session.commitTransaction();
            console.log("✅ Transaction committed successfully.");

            return updatedFruit;
        } catch (error) {
            await session.abortTransaction();
            console.log("🔁 Transaction rolled back.");

            throw error;
        } finally {
            await session.endSession();
        }
    }

    async removeFruit(name: string, amountToRemove: number): Promise<FruitEntity | null> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const fruit = await fruitRepository.findByName(name);
            if (!fruit) {
                throw new Error(`Fruit with name '${name}' not found.`);
            }

            fruit.remove(amountToRemove);

            const updatedFruit = await fruitRepository.updateFruit(fruit);

            if (updatedFruit) {
                const event = new FruitUpdatedEvent(updatedFruit);
                eventEmitter.emit("fruitUpdated", event);
            } else {
                throw new Error(`Updated fruit is null.`);
            }

            await session.commitTransaction();
            console.log("✅ Transaction committed successfully.");

            return updatedFruit;
        } catch (error) {
            await session.abortTransaction();
            console.log("🔁 Transaction rolled back.");

            throw error;
        } finally {
            await session.endSession();
        }
    }

    async deleteFruit(name: string, forceDelete = false): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const fruit = await fruitRepository.findByName(name);
            if (!fruit) {
                throw new Error(`Fruit with name '${name}' not found.`);
            }

            if (!forceDelete && fruit.hasStoredAmount()) {
                throw new Error("Cannot delete fruit with existing storage.");
            }

            await fruitRepository.delete(name);

            const event = new FruitDeletedEvent(name);
            eventEmitter.emit("fruitDeleted", event);

            await session.commitTransaction();
            console.log("✅ Transaction committed successfully.");
        } catch (error) {
            await session.abortTransaction();
            console.log("🔁 Transaction rolled back.");

            throw error;
        } finally {
            await session.endSession();
        }
    }

    async findFruit(name: string): Promise<FruitEntity | null> {
        const fruit = await fruitRepository.findByName(name);
        if (!fruit) throw new Error('Fruit not found.');
        return fruit;
    }
}

const fruitService = new FruitService();
export default fruitService;
