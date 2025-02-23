import { Schema, model, Document } from 'mongoose';

export interface OutboxEventDocument extends Document {
    type: string;
    payload: any;
    status: 'PENDING' | 'PROCESSED';
    createdAt: Date;
}

const outboxEventSchema = new Schema<OutboxEventDocument>({
    type: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['PENDING', 'PROCESSED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now },
});

const OutboxEventModel = model<Schema<OutboxEventDocument>>('OutboxEvent', outboxEventSchema);

export default OutboxEventModel;
