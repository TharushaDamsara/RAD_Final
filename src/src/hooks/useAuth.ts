import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { getCurrentUser } from '../store/slices/authSlice';
export function useAuth() {
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    loading
  } = useAppSelector(state => state.auth);
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);
  return {
    user,
    isAuthenticated,
    loading
  };
}