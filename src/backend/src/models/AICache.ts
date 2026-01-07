import mongoose, { Schema, Document } from 'mongoose';

export interface IAICache extends Document {
    userId: string;
    type: string;
    data: any;
    createdAt: Date;
}

const AICacheSchema: Schema = new Schema({
    userId: { type: String, required: true },
    type: { type: String, default: 'budget_tips', index: true },
    data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 }
});

// Compound index for efficient lookup
AICacheSchema.index({ userId: 1, type: 1 });

export const AICache = mongoose.model<IAICache>('AICache', AICacheSchema);
