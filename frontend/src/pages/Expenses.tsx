import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchExpenses, createExpense, deleteExpense } from '../store/slices/expenseSlice';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loader } from '../components/common/Loader';
import { Plus, Trash2, Calendar, Tag } from 'lucide-react';
import { showToast } from '../store/slices/uiSlice';

export function Expenses() {
    const dispatch = useAppDispatch();
    const { expenses, loading } = useAppSelector(state => state.expenses);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        category: 'other',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        dispatch(fetchExpenses({}));
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createExpense({
                ...formData,
                amount: Number(formData.amount)
            })).unwrap();

            dispatch(showToast({
                type: 'success',
                message: 'Expense added successfully'
            }));
            setShowForm(false);
            setFormData({
                amount: '',
                category: 'other',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            dispatch(showToast({
                type: 'error',
                message: 'Failed to add expense'
            }));
        }
    };

    if (loading && expenses.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                </Button>
            </div>

            {showForm && (
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Amount"
                                type="number"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                required
                                min="0"
                                step="0.01"
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="food">Food</option>
                                    <option value="transportation">Transportation</option>
                                    <option value="housing">Housing</option>
                                    <option value="utilities">Utilities</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="shopping">Shopping</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <Input
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                            <Input
                                label="Description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Expense</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="space-y-4">
                {expenses.map(expense => (
                    <Card key={expense._id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${expense.category === 'food' ? 'bg-orange-100 text-orange-600' :
                                expense.category === 'transportation' ? 'bg-blue-100 text-blue-600' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{expense.description || expense.category}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">
                                ${expense.amount.toFixed(2)}
                            </span>
                            <button
                                onClick={() => dispatch(deleteExpense(expense._id))}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
