
// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Expense Types
export type ExpenseCategory = 'food' | 'transportation' | 'housing' | 'utilities' | 'entertainment' | 'healthcare' | 'shopping' | 'other';
export type ExpenseType = 'essential' | 'non-essential';

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  expenseType: ExpenseType;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseState {
  expenses: Expense[];
  currentExpense: Expense | null;
  stats: any | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// UI Types
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toasts: Toast[];
  modal: {
    open: boolean;
    content: any;
  };
}

// AI Types
export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIState {
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

// Analytics Types
export interface SummaryData {
  total: number;
  count: number;
  average: number;
  highestSpendDay: { _id: string, dailyTotal: number } | null;
  typeBreakdown: {
    essential: number;
    'non-essential': number;
  };
}

export interface TrendData {
  date: string;
  amount: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface AnalyticsState {
  summary: SummaryData | null;
  trends: TrendData[];
  categories: CategoryData[];
  aiInsights: string | null;
  loading: boolean;
  error: string | null;
}