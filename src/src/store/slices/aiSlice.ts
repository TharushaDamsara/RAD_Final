import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface AIState {
    tips: string[];
    anomalies: any[];
    forecast: any;
    loading: boolean;
    error: string | null;
}

const initialState: AIState = {
    tips: [],
    anomalies: [],
    forecast: null,
    loading: false,
    error: null
};

export const fetchBudgetTips = createAsyncThunk(
    'ai/fetchTips',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/ai/budget-tips');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to generate AI tips');
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        clearAIError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBudgetTips.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBudgetTips.fulfilled, (state, action) => {
            state.loading = false;
            state.tips = action.payload.data.tips;
        });
        builder.addCase(fetchBudgetTips.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearAIError } = aiSlice.actions;
export default aiSlice.reducer;
