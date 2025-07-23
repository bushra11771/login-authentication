import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'https://auth-login-backend-8j45wnwtq-bushra11771s-projects.vercel.app/',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
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
      status: 'idle',
    };
  }

  try {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedData = JSON.parse(authData);
      const { user, token } = parsedData;
      
      if (token && !isTokenExpired(token)) {
        // Set the auth token for axios if it exists
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return {
          user,
          token,
          loading: false,
          error: null,
          isAuthenticated: true,
          status: 'succeeded',
        };
      }
    }
  } catch (error) {
    console.error('Failed to load auth data from storage:', error);
  }

  // Clear invalid/expired token
  localStorage.removeItem('authData');
  delete api.defaults.headers.common['Authorization'];
  return {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    status: 'idle',
  };
};


export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      console.log('Login response:', response.data);
      
      // Set authorization header for future requests
      if (response.data.jwt) {
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
        console.log('JWT token set in headers');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        errorMessage = error.response.data?.message || 
                      error.response.data?.error ||
                      error.response.statusText || 
                      `Server error (${error.response.status})`;
      } else if (error.request) {
        // Request was made but no response received (CORS or network issue)
        console.error('Network/CORS error - no response received:', error.request);
        errorMessage = 'Network error - check CORS configuration or server connectivity';
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Alternative function using fetch instead of axios (for testing)
export const loginUserWithFetch = createAsyncThunk(
  'auth/loginFetch',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Attempting login with fetch...');
      
      const response = await fetch('https://auth-login-backend-9kla-bushra11771s-projects.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Fetch error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetch success data:', data);
      
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
      
      return response.data;
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                       error.response.statusText || 
                       `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = 'Network error - server not responding';
      }
      
      return rejectWithValue(errorMessage);
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
      state.status = 'idle';
      localStorage.removeItem('authData');
      delete api.defaults.headers.common['Authorization'];
    },
    clearError: (state) => {
      state.error = null;
    },
    loadUserFromStorage: (state) => {
      const storedState = getInitialStateFromStorage();
      Object.assign(state, storedState);
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        state.isAuthenticated = true;
        state.error = null;
        state.status = 'succeeded';
        
        localStorage.setItem('authData', JSON.stringify({
          user: action.payload.user,
          token: action.payload.jwt
        }));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'failed';
      })
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        state.isAuthenticated = true;
        state.error = null;
        state.status = 'succeeded';
        
        localStorage.setItem('authData', JSON.stringify({
          user: action.payload.user,
          token: action.payload.jwt
        }));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'failed';
      });
  },
});

export const { logout, clearError, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;