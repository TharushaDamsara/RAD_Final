import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface SummaryData {
    total: number;
    count: number;
    average: number;
    highestSpendDay: { _id: string, dailyTotal: number } | null;
    typeBreakdown: {
        essential: number;
        'non-essential': number;
    };
}

interface TrendData {
    date: string;
    amount: number;
}

interface CategoryData {
    name: string;
    value: number;
}

interface AnalyticsState {
    summary: SummaryData | null;
    trends: TrendData[];
    categories: CategoryData[];
    aiInsights: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AnalyticsState = {
    summary: null,
    trends: [],
    categories: [],
    aiInsights: null,
    loading: false,
    error: null,
};

export const fetchSummary = createAsyncThunk(
    'analytics/fetchSummary',
    async (params: { startDate?: string, endDate?: string } | undefined, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/summary', { params });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch summary');
        }
    }
);

export const fetchTrends = createAsyncThunk(
    'analytics/fetchTrends',
    async (days: number | undefined, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/trends', { params: { days } });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch trends');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'analytics/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/categories');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
        }
    }
);

export const fetchAIInsights = createAsyncThunk(
    'analytics/fetchAIInsights',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/insights');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch AI insights');
        }
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        resetAnalytics: (state) => {
            state.summary = null;
            state.trends = [];
            state.categories = [];
            state.aiInsights = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Summary
            .addCase(fetchSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload;
            })
            .addCase(fetchSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Trends
            .addCase(fetchTrends.fulfilled, (state, action) => {
                state.trends = action.payload;
            })
            // Categories
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            // AI Insights
            .addCase(fetchAIInsights.fulfilled, (state, action) => {
                state.aiInsights = action.payload;
            });
    },
});

export const { resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
