import { Schema, model, Document } from 'mongoose';
import FruitEntity from "../entities/FruitEntity";

const fruitSchema = new Schema<FruitEntity>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    limitOfFruitToBeStored: { type: Number, required: true },
    amount: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

const FruitModel = model<Schema<FruitEntity>>('Fruit', fruitSchema);

export default FruitModel;