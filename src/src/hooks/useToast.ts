import { useAppDispatch } from '../store';
import { showToast as showToastAction, removeToast } from '../store/slices/uiSlice';
export function useToast() {
  const dispatch = useAppDispatch();
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    dispatch(showToastAction({
      message,
      type
    }));
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 5000);
  };
  return {
    showToast
  };
}