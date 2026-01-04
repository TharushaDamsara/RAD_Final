import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchBudgetTips } from '../store/slices/aiSlice';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

export function BudgetAI() {
    const dispatch = useAppDispatch();
    const { tips, loading, error } = useAppSelector(state => state.ai);

    useEffect(() => {
        dispatch(fetchBudgetTips());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">AI Budget Assistant</h1>
                <p className="text-gray-600">
                    Personalized insights and recommendations based on your spending habits.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Lightbulb className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Smart Tips</h2>
                    </div>
                    <div className="space-y-4">
                        {tips.length > 0 ? (
                            tips.map((tip, index) => (
                                <div key={index} className="flex gap-3 p-3 bg-white rounded-lg shadow-sm border border-blue-50">
                                    <span className="text-blue-500 font-bold">{index + 1}.</span>
                                    <p className="text-gray-700">{tip}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No tips available yet. Add more expenses to get insights!</p>
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Spending Forecast</h2>
                    </div>
                    <p className="text-gray-600">
                        Based on your current trajectory, you are on track to spend <span className="font-bold text-gray-900">$1,200</span> this month.
                        This is <span className="text-green-600 font-medium">15% less</span> than last month.
                    </p>
                    <div className="mt-6 h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                        [Chart Placeholder]
                    </div>
                </Card>
            </div>
        </div>
    );
}
