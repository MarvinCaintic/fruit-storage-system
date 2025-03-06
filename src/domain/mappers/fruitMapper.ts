import FruitEntity from "../entities/FruitEntity";
import {FruitDocument} from "../models/FruitModel";

class FruitMapper {
    static toDomain(raw: FruitDocument): FruitEntity {
        return FruitEntity.createFruit(
            raw.name,
            raw.description,
            raw.limitOfFruitToBeStored,
            raw.amount || 0,
            raw.createdAt || new Date() // Provide a default if createdAt is optional
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

export default FruitMapper;
