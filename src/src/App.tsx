import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Income } from './pages/Income';
import { Analytics } from './pages/Analytics';
import { BudgetAI } from './pages/BudgetAI';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

function PrivateRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    loading
  } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      Loading...
    </div>;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">
    <Navbar />
    <Sidebar />
    <main className="lg:ml-64 pt-16">{children}</main>
  </div>;
}

function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/dashboard" element={<PrivateRoute>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </PrivateRoute>} />

    <Route path="/expenses" element={<PrivateRoute>
      <AppLayout>
        <Expenses />
      </AppLayout>
    </PrivateRoute>} />

    <Route path="/income" element={<PrivateRoute>
      <AppLayout>
        <Income />
      </AppLayout>
    </PrivateRoute>} />

    <Route path="/analyze" element={<PrivateRoute>
      <AppLayout>
        <Analytics />
      </AppLayout>
    </PrivateRoute>} />

    <Route path="/budget-ai" element={<PrivateRoute>
      <AppLayout>
        <BudgetAI />
      </AppLayout>
    </PrivateRoute>} />

    <Route path="/profile" element={<PrivateRoute>
      <AppLayout>
        <Profile />
      </AppLayout>
    </PrivateRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>;
}

export function App() {
  return <Provider store={store}>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  </Provider>;
}