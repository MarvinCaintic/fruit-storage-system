import FruitModel from "../../domain/models/FruitModel";
import FruitEntity from "../../domain/entities/FruitEntity";
import FruitMapper from "../../domain/mappers/fruitMapper";

class FruitRepository {

    async save(fruit: FruitEntity): Promise<FruitEntity> {
        const existingFruit = await this.findByName(fruit.name);
        if (existingFruit) {
            throw new Error(`A fruit with the name '${fruit.name}' already exists.`);
        }

        const fruitPersistence = FruitMapper.toPersistence(fruit);
        const updatedFruitDoc = await FruitModel.findOneAndUpdate(
            { name: fruit.name },
            fruitPersistence,
            { upsert: true, new: true, lean: true }
        );
        if (!updatedFruitDoc) {
            throw new Error("Failed to save fruit.");
        }
        return FruitMapper.toDomain(updatedFruitDoc);
    }

    // Retrieves all fruits, converting each to a domain object -> UNUSED
    // async findAll(): Promise<FruitEntity[]> {
    //     const fruitDocs = await FruitModel.find().lean();
    //     return fruitDocs.map((doc) => FruitMapper.toDomain(doc));
    // }

    // Finds a fruit by its unique name and converts it to a domain object
    async findByName(name: string): Promise<FruitEntity | null> {
        const fruitDoc = await FruitModel.findOne({ name }).lean();
        return fruitDoc ? FruitMapper.toDomain(fruitDoc) : null;
    }

    // Deletes a fruit by its unique name; returns nothing (void)
    async delete(name: string, forceDelete: boolean = false): Promise<void> {
        const existingFruit = await this.findByName(name);
        if (!existingFruit) {
            throw new Error(`Fruit with name '${name}' not found.`);
        }

        if (!forceDelete && existingFruit.hasStoredAmount()) {
            throw new Error('Cannot delete fruit with existing storage.');
        }
        await FruitModel.deleteOne({ name });
    }

    // Updates a fruit by its name; returns the updated domain object (if found)
    async updateFruit(name: string, description: string, limitOfFruitToBeStored: number): Promise<FruitEntity | null> {
        const existingFruit = await this.findByName(name);
        if (!existingFruit) {
            throw new Error(`Fruit with name '${name}' not found.`);
        }

        existingFruit.update(description, limitOfFruitToBeStored);

        const updatedFruitDoc = await FruitModel.findOneAndUpdate(
            { name },
            {
                description: existingFruit.description,
                limitOfFruitToBeStored: existingFruit.limitOfFruitToBeStored
            },
            { new: true, lean: true }
        );

        return updatedFruitDoc ? FruitMapper.toDomain(updatedFruitDoc) : null;
    }


    // Stores fruits to storage if the total amount does not exceed the storage limit
    async storeFruit(name: string, amountToStore: number): Promise<FruitEntity | null> {
        const existingFruit = await this.findByName(name);
        if (!existingFruit) {
            throw new Error(`Fruit with name '${name}' not found.`);
        }

        existingFruit.store(amountToStore);

        const updatedFruitDoc = await FruitModel.findOneAndUpdate(
            { name },
            { amount: existingFruit.amount },
            { new: true, lean: true }
        );

        return updatedFruitDoc ? FruitMapper.toDomain(updatedFruitDoc) : null;
    }

    async removeFruit(name: string, amountToRemove: number): Promise<FruitEntity | null> {
        const existingFruit = await this.findByName(name);
        if (!existingFruit) {
            throw new Error(`Fruit with name '${name}' not found.`);
        }

        existingFruit.remove(amountToRemove);

        const updatedFruitDoc = await FruitModel.findOneAndUpdate(
            { name },
            { amount: existingFruit.amount },
            { new: true, lean: true }
        );

        return updatedFruitDoc ? FruitMapper.toDomain(updatedFruitDoc) : null;
    }
}

const fruitRepository = new FruitRepository();
export default fruitRepository;