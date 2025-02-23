import FruitEntity from "../entities/FruitEntity";

class FruitMapper {
    static toDomain(raw: any): FruitEntity {
        return FruitEntity.createFruit(
            raw.name,
            raw.description,
            raw.limitOfFruitToBeStored,
            raw.amount || 0,
            raw.createdAt
        );
    }

    static toPersistence(fruit: FruitEntity): any {
        return {
            name: fruit.getName(),
            description: fruit.getDescription(),
            limitOfFruitToBeStored: fruit.getLimit(),
            amount: fruit.getAmount(),
            createdAt: fruit.getCreatedAt(),
        };
    }
}

export default FruitMapper
