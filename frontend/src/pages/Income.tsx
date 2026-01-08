import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchIncomes, createIncome, deleteIncome } from '../store/slices/incomeSlice';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loader } from '../components/common/Loader';
import { Plus, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { showToast } from '../store/slices/uiSlice';

export function Income() {
    const dispatch = useAppDispatch();
    const { incomes, loading } = useAppSelector(state => state.incomes);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        source: 'salary',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        dispatch(fetchIncomes({}));
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createIncome({
                ...formData,
                amount: Number(formData.amount)
            })).unwrap();

            dispatch(showToast({
                type: 'success',
                message: 'Income added successfully'
            }));
            setShowForm(false);
            setFormData({
                amount: '',
                source: 'salary',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            dispatch(showToast({
                type: 'error',
                message: 'Failed to add income'
            }));
        }
    };

    if (loading && incomes.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Income</h1>
                <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Income
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
                                <label className="text-sm font-medium text-gray-700">Source</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.source}
                                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                                >
                                    <option value="salary">Salary</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="investments">Investments</option>
                                    <option value="gift">Gift</option>
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
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Income</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="space-y-4">
                {incomes.map(income => (
                    <Card key={income._id} className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{income.description || income.source}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(income.date).toLocaleDateString()}</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs uppercase font-bold">{income.source}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-emerald-600">
                                +${income.amount.toFixed(2)}
                            </span>
                            <button
                                onClick={() => dispatch(deleteIncome(income._id))}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </Card>
                ))}
                {incomes.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No income records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
