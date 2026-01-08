import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchBudgetTips, sendChatMessage } from '../store/slices/aiSlice';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { Lightbulb, Send, User, Bot, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export function BudgetAI() {
    const dispatch = useAppDispatch();
    const { tips, forecast, anomalies, chatHistory, loading, chatLoading } = useAppSelector(state => state.ai);
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchBudgetTips());
    }, [dispatch]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!message.trim() || chatLoading) return;

        const msg = message;
        setMessage('');
        await dispatch(sendChatMessage(msg));
    };

    if (loading && !tips.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 h-[calc(100vh-64px)] flex flex-col md:flex-row gap-6">
            {/* Left Panel: Analysis & Insights */}
            <div className="w-full md:w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">

                {/* 1. Spending Forecast */}
                {forecast && (
                    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Forecast</h2>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-bold text-gray-900">${forecast.amount}</span>
                            <span className="text-gray-500 text-sm">est. this month</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block mb-3 ${forecast.trend === 'decreasing' ? 'bg-emerald-100 text-emerald-700' :
                            forecast.trend === 'stable' ? 'bg-blue-100 text-blue-700' :
                                'bg-orange-100 text-orange-700'
                            }`}>
                            Trend: {forecast.trend.charAt(0).toUpperCase() + forecast.trend.slice(1)}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{forecast.reason}</p>
                    </Card>
                )}

                {/* 2. Anomalies Alert */}
                {anomalies && anomalies.length > 0 && (
                    <Card className="bg-red-50 border-red-100 animate-pulse-slow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Unusual Activity</h2>
                        </div>
                        <div className="space-y-3">
                            {anomalies.map((item: any, idx: number) => (
                                <div key={idx} className="bg-white/60 p-3 rounded-lg border border-red-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-800">{item.description}</span>
                                        <span className="font-bold text-red-600">${item.amount}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* 3. Budget Tips */}
                <Card className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 overflow-hidden flex flex-col min-h-[300px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Lightbulb className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Smart Tips</h2>
                    </div>

                    <div className="space-y-4">
                        {tips.length > 0 ? (
                            tips.map((tip, index) => (
                                <div key={index} className="flex gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100/50 hover:shadow-md transition-all duration-300">
                                    <span className="text-blue-500 font-bold text-lg">#{index + 1}</span>
                                    <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                <p>No insights yet.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Right Panel: Chat Interface */}
            <div className="w-full md:w-2/3 flex flex-col h-full">
                <Card className="flex-1 flex flex-col p-0 overflow-hidden border-gray-200 shadow-xl bg-white/50 backdrop-blur-xl">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center shadow-lg">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Financial Assistant</h3>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                        {chatHistory.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                                <Bot className="w-16 h-16 mb-4" />
                                <p className="text-lg font-medium">Ask me anything about your budget!</p>
                                <p className="text-sm">"How much did I spend on food?"</p>
                            </div>
                        )}

                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-gray-900 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {chatLoading && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="flex gap-3">
                            <Input
                                value={message}
                                onChange={(e: any) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                                disabled={chatLoading}
                            />
                            <Button
                                type="submit"
                                disabled={chatLoading || !message.trim()}
                                className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-6"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}
