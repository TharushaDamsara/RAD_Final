import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { register } from '../store/slices/authSlice';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error
  } = useAppSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">Start managing your projects today</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" type="text" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} required />

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
            {loading ? <Loader size="sm" /> : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>;
}