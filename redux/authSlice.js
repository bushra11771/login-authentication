import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

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
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/signup',
  async ({name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/signup', {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);



const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false, 
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authData');
    },
    loadUserFromStorage: (state) => {
      try {
        const authData = localStorage.getItem('authData');
        
        if (authData) {
          const parsedData = JSON.parse(authData);
          state.user = parsedData.user;
          // state.token = parsedData.token;
          state.isAuthenticated = true;
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
        // Clear corrupted data
        localStorage.removeItem('authData');
        // or sessionStorage.removeItem('authData');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Save auth data to storage
        localStorage.setItem('authData', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token
        }));
        // or sessionStorage.setItem(...)
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Save auth data to storage
        localStorage.setItem('authData', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token
        }));
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;