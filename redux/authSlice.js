import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.defaults.baseURL = 'http://localhost:5000';

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  
  } catch (error) {
    console.error('Invalid token:', error);
    return true;
  }
};

// Helper function to get initial state from storage
const getInitialStateFromStorage = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    };
  }

  try {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedData = JSON.parse(authData);
      const { user, token } = parsedData;
      
      if (token && !isTokenExpired(token)) {
        return {
          user,
          token,
          loading: false,
          error: null,
          isAuthenticated: true,
        };
      } else {
        // Token expired, clear storage
        localStorage.removeItem('authData');
      }
    }
  } catch (error) {
    console.error('Failed to load auth data from storage:', error);
    localStorage.removeItem('authData');
  }

  return {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  };
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message || 'Login failed');
      }
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/signup', {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message || 'Registration failed');
      }
    }
  }
);

// Get initial state
const initialState = getInitialStateFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authData');
    },
    clearError: (state) => {
      state.error = null;
    },
    loadUserFromStorage: (state) => {
      try {
        const authData = localStorage.getItem('authData');
        
        if (authData) {
          const parsedData = JSON.parse(authData);
          const { user, token } = parsedData;
          
          if (token && !isTokenExpired(token)) {
            console.log('User loaded from storage:', user);
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
          } else {
            // Token expired
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authData');
          }
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        localStorage.removeItem('authData');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        state.isAuthenticated = true;
        state.error = null;
        
        // Save auth data to storage
        localStorage.setItem('authData', JSON.stringify({
          user: action.payload.user,
          token: action.payload.jwt
        }));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        state.isAuthenticated = true;
        state.error = null;
        
        // Save auth data to storage
        localStorage.setItem('authData', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token
        }));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;