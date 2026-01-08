
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
export function NotFound() {
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mt-4">
          Page Not Found
        </p>
        <p className="text-gray-600 mt-2 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>;
}