import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, Shield, Sparkles } from 'lucide-react';

export function Landing() {
  const features = [{
    icon: Wallet,
    title: 'Expense Tracking',
    description: 'Effortlessly track daily expenses and stay on top of your finances.'
  }, {
    icon: Sparkles,
    title: 'AI Budget Assistant',
    description: 'Get personalized insights and savings tips from our intelligent AI.'
  }, {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Bank-grade security ensures your financial data stays protected.'
  }, {
    icon: TrendingUp,
    title: 'Smart Analytics',
    description: 'Visualize your spending patterns with beautiful interactive charts.'
  }];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-20" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10 brightness-100 contrast-150" />

      <nav className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg shadow-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            ExpenseAI
          </h1>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2.5 text-gray-700 hover:text-primary-600 font-medium transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />

          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary-200 bg-primary-50/50 text-primary-700 font-medium text-sm animate-fade-in">
            ✨ Now with AI-Powered Insights
          </div>

          <h2 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 mb-8 leading-tight animate-slide-up">
            Personal Expense Tracker<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              with AI-Powered
            </span><br />
            Budgeting Assistance
          </h2>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Take control of your money with intelligence. Track, analyze, and optimize your spending with the help of next-gen AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-lg font-bold rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-1">
              Start Tracking Free
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 text-lg font-bold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-1">
              View Demo
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({
            icon: Icon,
            title,
            description
          }, index) => (
            <div
              key={title}
              className="group glass-card p-8 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}