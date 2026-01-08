import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface Income {
    _id: string;
    amount: number;
    source: string;
    description: string;
    date: string;
    userId: string;
}

interface IncomeState {
    incomes: Income[];
    stats: any;
    loading: boolean;
    error: string | null;
    pagination: {
        current: number;
        total: number;
        count: number;
    };
}

const initialState: IncomeState = {
    incomes: [],
    stats: null,
    loading: false,
    error: null,
    pagination: {
        current: 1,
        total: 1,
        count: 0
    }
};

export const fetchIncomes = createAsyncThunk(
    'incomes/fetchAll',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/incomes', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch incomes');
        }
    }
);

export const createIncome = createAsyncThunk(
    'incomes/create',
    async (data: Partial<Income>, { rejectWithValue }) => {
        try {
            const response = await api.post('/incomes', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create income');
        }
    }
);

export const updateIncome = createAsyncThunk(
    'incomes/update',
    async ({ id, data }: { id: string; data: Partial<Income> }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/incomes/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update income');
        }
    }
);

export const deleteIncome = createAsyncThunk(
    'incomes/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/incomes/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete income');
        }
    }
);

export const fetchIncomeStats = createAsyncThunk(
    'incomes/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/incomes/stats');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
        }
    }
);

const incomeSlice = createSlice({
    name: 'incomes',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Incomes
        builder.addCase(fetchIncomes.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchIncomes.fulfilled, (state, action) => {
            state.loading = false;
            state.incomes = action.payload.data;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(fetchIncomes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create Income
        builder.addCase(createIncome.fulfilled, (state, action) => {
            state.incomes.unshift(action.payload.data);
        });

        // Update Income
        builder.addCase(updateIncome.fulfilled, (state, action) => {
            const index = state.incomes.findIndex(i => i._id === action.payload.data._id);
            if (index !== -1) {
                state.incomes[index] = action.payload.data;
            }
        });

        // Delete Income
        builder.addCase(deleteIncome.fulfilled, (state, action) => {
            state.incomes = state.incomes.filter(i => i._id !== action.payload);
        });

        // Stats
        builder.addCase(fetchIncomeStats.fulfilled, (state, action) => {
            state.stats = action.payload.data;
        });
    }
});

export const { clearError } = incomeSlice.actions;
export default incomeSlice.reducer;
