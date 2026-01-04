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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your financial health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
              </div>
              <div className={`p-3 bg-${color}-100 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Expenses
          </h2>
          <div className="space-y-3">
            {expenses.slice(0, 5).map(expense => (
              <div key={expense._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{expense.description || expense.category}</p>
                  <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <span className="font-semibold text-gray-900">-${expense.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
