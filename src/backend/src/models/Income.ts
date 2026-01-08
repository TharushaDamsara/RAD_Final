import mongoose, { Schema, Document } from 'mongoose';

export interface IIncome extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    source: 'salary' | 'freelance' | 'investments' | 'gift' | 'other';
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const incomeSchema = new Schema<IIncome>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive']
    },
    source: {
        type: String,
        enum: ['salary', 'freelance', 'investments', 'gift', 'other'],
        required: [true, 'Source is required'],
        default: 'other'
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

export const Income = mongoose.model<IIncome>('Income', incomeSchema);
