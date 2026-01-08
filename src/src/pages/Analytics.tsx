
import { useEffect, useState } from 'react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  DollarSign, Calendar,
  Brain, AlertCircle, PieChart as PieChartIcon,
  Activity, ArrowUpRight, Zap, TrendingUp
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchSummary, fetchTrends, fetchCategories, fetchAIInsights
} from '../store/slices/analyticsSlice';
import { motion } from 'framer-motion';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export function Analytics() {
  const dispatch = useAppDispatch();
  const { summary, trends, categories, aiInsights } = useAppSelector((state) => state.analytics);
  const [days, setDays] = useState(30);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchTrends(days));
    dispatch(fetchCategories());
    dispatch(fetchAIInsights());
  }, [dispatch, days]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      className="p-6 space-y-8 bg-gray-50/50 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Financial Analytics</h1>
          <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Live insights from your spending patterns
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-gray-100">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${days === d
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Expenses"
          value={`$${summary?.total.toLocaleString() || '0'}`}
          icon={<DollarSign className="w-6 h-6" />}
          trend={`${summary?.count || 0} transactions`}
          color="blue"
        />
        <SummaryCard
          title="Total Income"
          value={`$${summary?.totalIncome?.toLocaleString() || '0'}`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={`Balance: $${summary?.balance?.toLocaleString() || 0}`}
          color="emerald"
        />
        <SummaryCard
          title="Savings Rate"
          value={`${summary?.savingsRate?.toFixed(1) || '0'}%`}
          icon={<Zap className="w-6 h-6" />}
          trend="of total income"
          color="purple"
        />
        <SummaryCard
          title="Max Daily Spend"
          value={`$${summary?.highestSpendDay?.dailyTotal.toLocaleString() || '0'}`}
          icon={<AlertCircle className="w-6 h-6" />}
          trend={summary?.highestSpendDay?._id || 'No data'}
          color="amber"
          isMax
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Spending Trend Line Chart */}
        <Card className="lg:col-span-2 p-8 bg-white/70 backdrop-blur-xl border-white/40 shadow-xl rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Spending Patterns</h2>
              <p className="text-gray-500 text-sm">Daily expense fluctuations over time</p>
            </div>
            <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          <div className="h-[350px] w-full">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    animationBegin={0}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No trend data available for this range" />
            )}
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-8 bg-white/70 backdrop-blur-xl border-white/40 shadow-xl rounded-[2rem]">
          <div className="flex items-center gap-2 mb-8">
            <PieChartIcon className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          </div>
          <div className="h-[350px]">
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {categories.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No category data" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categories.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-xs font-bold text-gray-600 truncate uppercase tracking-wider">{c.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Insights Panel */}
        <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl rounded-[2rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Smart Insights</h2>
            </div>

            <div className="space-y-4">
              {aiInsights ? (
                <div className="text-blue-50/90 leading-relaxed font-medium">
                  {aiInsights.split('\n').filter(line => line.trim()).map((line, i) => (
                    <motion.p
                      key={i}
                      className="mb-4 flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                      {line.replace(/^-\s*/, '')}
                    </motion.p>
                  ))}
                </div>
              ) : (
                <p className="text-blue-100 opacity-60">AI is analyzing your spending patterns...</p>
              )}
            </div>
          </div>
        </Card>

        {/* Essential vs Non-Essential Breakdown */}
        <Card className="p-8 bg-white/70 backdrop-blur-xl border-white/40 shadow-xl rounded-[2rem]">
          <div className="flex items-center gap-2 mb-8">
            <Activity className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Budget Composition</h2>
          </div>
          <div className="flex flex-col h-[280px] justify-center">
            {summary?.typeBreakdown ? (
              <div className="space-y-8">
                <CompositionBar
                  label="Essential"
                  value={summary.typeBreakdown.essential || 0}
                  total={summary.total}
                  color="bg-emerald-500"
                />
                <CompositionBar
                  label="Non-Essential"
                  value={summary.typeBreakdown['non-essential'] || 0}
                  total={summary.total}
                  color="bg-amber-500"
                />
              </div>
            ) : (
              <EmptyState message="No budget data" />
            )}
          </div>
        </Card>

        {/* Smart Detections */}
        <Card className="p-8 bg-white/70 backdrop-blur-xl border-white/40 shadow-xl rounded-[2rem]">
          <div className="flex items-center gap-2 mb-8">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Smart Detections</h2>
          </div>
          <div className="space-y-4">
            <DetectionItem
              icon={<TrendingUp className="w-5 h-5 text-red-500" />}
              title="Spending Spike Detected"
              description={`Your spending on ${summary?.highestSpendDay?._id || 'recent date'} was significantly higher than average.`}
              status="High Alert"
              color="red"
            />
            <DetectionItem
              icon={<Activity className="w-5 h-5 text-blue-500" />}
              title="Recurring Pattern"
              description="We detected similar transactions this week. Potential subscription?"
              status="Observation"
              color="blue"
            />
            <DetectionItem
              icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
              title="Budget Threshold"
              description="You've reached 85% of your typical monthly non-essential budget."
              status="Warning"
              color="amber"
            />
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function SummaryCard({ title, value, icon, trend, color, isMax = false }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 ${colorMap[color]}`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isMax ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
            {isMax ? <AlertCircle className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
            {isMax ? 'Peak' : 'Live'}
          </div>
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        <p className="text-xs font-semibold text-gray-400 mt-2 flex items-center gap-1">
          {trend}
        </p>
      </Card>
    </motion.div>
  );
}

function CompositionBar({ label, value, total, color }: any) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{label}</span>
          <p className="text-2xl font-black text-gray-900">${value.toLocaleString()}</p>
        </div>
        <span className="text-sm font-bold text-gray-500">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function DetectionItem({ icon, title, description, status, color }: any) {
  const colorMap: any = {
    red: 'bg-red-50 text-red-700 border-red-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color]} flex gap-4 items-start`}>
      <div className="mt-1">{icon}</div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm">{title}</h4>
          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-white/50">{status}</span>
        </div>
        <p className="text-xs opacity-80 mt-1 font-medium">{description}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 space-y-2">
      <PieChartIcon className="w-12 h-12 opacity-20" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}