import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface Expense {
    _id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    userId: string;
}

interface ExpenseState {
    expenses: Expense[];
    stats: any;
    loading: boolean;
    error: string | null;
    pagination: {
        current: number;
        total: number;
        count: number;
    };
}

const initialState: ExpenseState = {
    expenses: [],
    stats: null,
    loading: false,
    error: null,
    pagination: {
        current: 1,
        total: 1,
        count: 0
    }
};

export const fetchExpenses = createAsyncThunk(
    'expenses/fetchAll',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/expenses', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch expenses');
        }
    }
);

export const createExpense = createAsyncThunk(
    'expenses/create',
    async (data: Partial<Expense>, { rejectWithValue }) => {
        try {
            const response = await api.post('/expenses', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create expense');
        }
    }
);

export const updateExpense = createAsyncThunk(
    'expenses/update',
    async ({ id, data }: { id: string; data: Partial<Expense> }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/expenses/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update expense');
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/expenses/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete expense');
        }
    }
);

export const fetchExpenseStats = createAsyncThunk(
    'expenses/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/expenses/stats');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
        }
    }
);

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Expenses
        builder.addCase(fetchExpenses.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchExpenses.fulfilled, (state, action) => {
            state.loading = false;
            state.expenses = action.payload.data;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(fetchExpenses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create Expense
        builder.addCase(createExpense.fulfilled, (state, action) => {
            state.expenses.unshift(action.payload.data);
        });

        // Update Expense
        builder.addCase(updateExpense.fulfilled, (state, action) => {
            const index = state.expenses.findIndex(e => e._id === action.payload.data._id);
            if (index !== -1) {
                state.expenses[index] = action.payload.data;
            }
        });

        // Delete Expense
        builder.addCase(deleteExpense.fulfilled, (state, action) => {
            state.expenses = state.expenses.filter(e => e._id !== action.payload);
        });

        // Stats
        builder.addCase(fetchExpenseStats.fulfilled, (state, action) => {
            state.stats = action.payload.data;
        });
    }
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
