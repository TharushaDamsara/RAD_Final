import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, BarChart3, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSidebarOpen } from '../../store/slices/uiSlice';
export function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    sidebarOpen
  } = useAppSelector(state => state.ui);
  const links = [{
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  }, {
    to: '/projects',
    icon: FolderKanban,
    label: 'Projects'
  }, {
    to: '/tasks',
    icon: CheckSquare,
    label: 'Tasks'
  }, {
    to: '/analytics',
    icon: BarChart3,
    label: 'Analytics'
  }];
  if (!sidebarOpen) return null;
  return <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />

      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="font-semibold text-gray-900">Menu</h2>
            <button onClick={() => dispatch(setSidebarOpen(false))} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {links.map(({
            to,
            icon: Icon,
            label
          }) => {
            const isActive = location.pathname === to;
            return <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>;
          })}
          </nav>
        </div>
      </aside>
    </>;
}