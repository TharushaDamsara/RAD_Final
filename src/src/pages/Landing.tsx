
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Shield, BarChart3 } from 'lucide-react';
export function Landing() {
  const features = [{
    icon: CheckCircle,
    title: 'Task Management',
    description: 'Organize and track tasks efficiently'
  }, {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Stay synced with your team instantly'
  }, {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security for your data'
  }, {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Insights to boost productivity'
  }];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Projects.
            <br />
            Ship Faster.
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The modern task management platform built for high-performing teams.
            Plan, track, and deliver with confidence.
          </p>
          <Link to="/register" className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Start Free Trial
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map(({
          icon: Icon,
          title,
          description
        }) => <div key={title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>)}
        </div>
      </main>
    </div>;
}