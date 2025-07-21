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
      todos: [],
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
    console.log("Found authData in localStorage:", authData); 

    if (authData) {
      const parsedData = JSON.parse(authData);
      const { user, token } = parsedData;
      console.log("Token exists?", !!token); 
      console.log("Token expired?", isTokenExpired(token));
      
      if (token && !isTokenExpired(token)) {
        console.log("Returning authenticated state"); 
        return {
          user,
          token,
          loading: false,
          error: null,
          isAuthenticated: true,
          status: 'succeeded',
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
    status: 'idle',
  };
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', { email, password }); // Log the credentials being sent
      
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data); // Log the successful response
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Log the error details
      
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
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.status = 'idle';
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
            state.status = 'succeeded';
          } else {
            // Token expired
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            localStorage.removeItem('authData');
          }
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        localStorage.removeItem('authData');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        console.log('Login request started');
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Login successful - payload:', action.payload);
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
        console.log('Login failed - error:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Login failed';
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
        state.error = action.payload || 'Registration failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'failed';
      });
  },
});

export const { setUser, logout, clearError, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;