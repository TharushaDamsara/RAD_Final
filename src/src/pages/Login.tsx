import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { login } from '../store/slices/authSlice';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error
  } = useAppSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} required />

          <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({
            ...formData,
            password: e.target.value
          })} required />

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader size="sm" /> : 'Sign In'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>;
}