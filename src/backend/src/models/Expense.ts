import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    category: 'food' | 'transportation' | 'housing' | 'utilities' | 'entertainment' | 'healthcare' | 'shopping' | 'other';
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
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
    category: {
        type: String,
        enum: ['food', 'transportation', 'housing', 'utilities', 'entertainment', 'healthcare', 'shopping', 'other'],
        required: [true, 'Category is required'],
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

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
