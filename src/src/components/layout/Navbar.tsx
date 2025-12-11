import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    user
  } = useAppSelector(state => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  return <nav className="bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => dispatch(toggleSidebar())} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/dashboard" className="text-xl font-bold text-gray-900">
            TaskFlow
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.name}</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>;
}