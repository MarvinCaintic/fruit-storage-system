import { Schema, model, Document } from 'mongoose';
import OutboxEventModel from './OutboxEvent';

export interface FruitDocument extends Document {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
    amount?: number;
    createdAt?: Date;
}

const fruitSchema = new Schema<FruitDocument>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    limitOfFruitToBeStored: { type: Number, required: true },
    amount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

// Middleware to emit domain events
fruitSchema.post('save', async function (doc) {
    await OutboxEventModel.create({
        type: 'FRUIT_CREATED',
        payload: doc.toObject(),
    });
});

fruitSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        await OutboxEventModel.create({
            type: 'FRUIT_UPDATED',
            payload: doc,
        });
    }
});

fruitSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await OutboxEventModel.create({
            type: 'FRUIT_DELETED',
            payload: doc,
        });
    }
});

const FruitModel = model<Schema<FruitDocument>>('Fruit', fruitSchema);

export default FruitModel;
