import FruitEntity from "../entities/FruitEntity";

class FruitMapper {
    static toDomain(raw: any): FruitEntity {
        if (!raw) {
            throw new Error("Invalid fruit data");
        }
        return new FruitEntity(
            raw.name,
            raw.description,
            raw.limitOfFruitToBeStored,
            raw.amount || 0,
            raw.createdAt
        );
    }

    static toPersistence(fruit: FruitEntity): any {
        return {
            name: fruit.name,
            description: fruit.description,
            limitOfFruitToBeStored: fruit.limitOfFruitToBeStored,
            amount: fruit.amount,
            createdAt: fruit.createdAt,
        };
    }
}

export default FruitMapper
