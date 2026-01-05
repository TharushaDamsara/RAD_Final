
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface AIChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface AIState {
    tips: string[];
    forecast: {
        amount: number;
        trend: string;
        reason: string;
    } | null;
    anomalies: {
        description: string;
        amount: number;
        date: string;
    }[];
    chatHistory: AIChatMessage[];
    loading: boolean;
    chatLoading: boolean;
    error: string | null;
}

const initialState: AIState = {
    tips: [],
    forecast: null,
    anomalies: [],
    chatHistory: [],
    loading: false,
    chatLoading: false,
    error: null,
};

export const fetchBudgetTips = createAsyncThunk(
    'ai/fetchBudgetTips',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/ai/budget-tips');
            return response.data.data; // Return the whole object
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch tips');
        }
    }
);

export const sendChatMessage = createAsyncThunk(
    'ai/sendChatMessage',
    async (message: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/ai/chat', { message });
            return response.data.data.response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to send message');
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        clearChat: (state) => {
            state.chatHistory = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Budget Tips
            .addCase(fetchBudgetTips.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBudgetTips.fulfilled, (state, action) => {
                state.loading = false;
                state.tips = action.payload.tips;
                state.forecast = action.payload.forecast;
                state.anomalies = action.payload.anomalies;
            })
            .addCase(fetchBudgetTips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Chat
            .addCase(sendChatMessage.pending, (state, action) => {
                state.chatLoading = true;
                state.error = null;
                // Optimistically add user message
                state.chatHistory.push({ role: 'user', content: action.meta.arg });
            })
            .addCase(sendChatMessage.fulfilled, (state, action) => {
                state.chatLoading = false;
                state.chatHistory.push({ role: 'assistant', content: action.payload });
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.chatLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearChat } = aiSlice.actions;
export default aiSlice.reducer;
