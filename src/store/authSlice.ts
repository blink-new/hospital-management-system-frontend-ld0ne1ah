import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, AuthResponse } from '../types/auth';

// Mock API calls - replace with actual API endpoints
const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on email
  const mockUsers: Record<string, User> = {
    'admin@hospital.com': {
      id: '1',
      email: 'admin@hospital.com',
      firstName: 'John',
      lastName: 'Admin',
      role: 'admin',
      department: 'Administration',
      phone: '+1-555-0101',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    'doctor@hospital.com': {
      id: '2',
      email: 'doctor@hospital.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'doctor',
      department: 'Cardiology',
      phone: '+1-555-0102',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    'nurse@hospital.com': {
      id: '3',
      email: 'nurse@hospital.com',
      firstName: 'Emily',
      lastName: 'Davis',
      role: 'nurse',
      department: 'Emergency',
      phone: '+1-555-0103',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  };

  const user = mockUsers[credentials.email];
  if (!user || credentials.password !== 'password123') {
    throw new Error('Invalid credentials');
  }

  return {
    user,
    token: `mock-jwt-token-${user.id}`
  };
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await mockLogin(credentials);
    localStorage.setItem('token', response.token);
    return response;
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      // Clear any error states if needed
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;