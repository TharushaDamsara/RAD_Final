import { useEffect } from 'react';
import { DollarSign, Activity } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchExpenses, fetchExpenseStats } from '../store/slices/expenseSlice';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { expenses, stats, loading } = useAppSelector(state => state.expenses);

  useEffect(() => {
    dispatch(fetchExpenses({ limit: 5 }));
    dispatch(fetchExpenseStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  // Calculate some basic stats if not available from backend yet
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const recentTransactionCount = expenses.length;

  const dashboardStats = [
    {
      label: 'Total Expenses',
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Recent Transactions',
      value: recentTransactionCount,
      icon: Activity,
      color: 'green'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Overview of your financial health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {dashboardStats.map(({ label, value, icon: Icon, color }, index) => (
          <Card key={label} className={`p-6 border-l-4 border-${color}-500 transform transition-all duration-300 hover:scale-105`} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
              </div>
              <div className={`p-4 bg-${color}-50 rounded-2xl shadow-inner`}>
                <Icon className={`w-8 h-8 text-${color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 animate-slide-up">
        <Card className="p-6" title="Recent Expenses">
          <div className="space-y-4">
            {expenses.slice(0, 5).map((expense, index) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-12 bg-primary-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{expense.description || expense.category}</p>
                    <p className="text-sm text-gray-500 font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900 text-lg">-${expense.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
