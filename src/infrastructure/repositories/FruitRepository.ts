import FruitModel from "../../domain/models/FruitModel";
import FruitMapper from "../../domain/mappers/fruitMapper";
import FruitEntity from "../../domain/entities/FruitEntity";

class FruitRepository {
    async save(fruit: FruitEntity): Promise<FruitEntity> {
        const fruitPersistence = FruitMapper.toPersistence(fruit);

        const updatedFruitDoc = await FruitModel.findOneAndUpdate(
            { name: fruit.getName() },
            fruitPersistence,
            {
                upsert: true,
                new: true,
                lean: true,
            }
        );

        if (!updatedFruitDoc) {
            throw new Error("Failed to save fruit.");
        }

        return FruitMapper.toDomain(updatedFruitDoc);
    }

    // ✅ Find by name (No session needed)
    async findByName(name: string): Promise<FruitEntity | null> {
        const fruitDoc = await FruitModel.findOne({ name }).lean();
        return fruitDoc ? FruitMapper.toDomain(fruitDoc) : null;
    }

    // ✅ Delete with transaction support
    async delete(name: string): Promise<void> {
        await FruitModel.findOneAndDelete({ name });
    }

    // ✅ Update with transaction support
    async updateFruit(fruit: FruitEntity): Promise<FruitEntity | null> {
        const updatedFruitDoc = await FruitModel.findOneAndUpdate(
            { name: fruit.getName() },
            {
                description: fruit.getDescription(),
                limitOfFruitToBeStored: fruit.getLimit(),
                amount: fruit.getAmount()
            },
            {
                new: true,
                lean: true,
            }
        );

        return updatedFruitDoc ? FruitMapper.toDomain(updatedFruitDoc) : null;
    }
}

const fruitRepository = new FruitRepository();
export default fruitRepository;
