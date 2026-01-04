import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeToast } from '../../store/slices/uiSlice';
export function ToastContainer() {
  const {
    toasts
  } = useAppSelector(state => state.ui);
  const dispatch = useAppDispatch();
  return <div className="fixed bottom-4 right-4 z-50 space-y-2">
    {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => dispatch(removeToast(toast.id))} />)}
  </div>;
}
interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}
function Toast({
  message,
  type,
  onClose
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };
  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };
  return <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[type]} min-w-[300px]`}>
    {icons[type]}
    <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
      <X className="w-4 h-4" />
    </button>
  </div>;
}