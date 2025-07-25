import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loginAsync, logoutAsync } from '../store/authSlice';
import { LoginCredentials } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginAsync(credentials));
  };

  const logout = async () => {
    return dispatch(logoutAsync());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};