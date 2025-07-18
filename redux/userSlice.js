import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.get('/api/users', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Deactivate/Activate user
export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.patch(`/api/users/${userId}/status`, {}, config);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Edit user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.put(`/api/users/${userId}`, userData, config);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.delete(`/api/users/${userId}`, config);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
// Update own profile
export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      const { data } = await axios.put('/api/users/profile', formData, config);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(u => u._id !== action.payload);
    })
    .addCase(updateProfile.fulfilled, (state, action) => {
      // Update the user in auth and users state if needed
      state.profileUpdateSuccess = true;
      state.users = state.users.map(u => u._id === action.payload._id ? action.payload : u);
    })
    .addCase(updateProfile.rejected, (state, action) => {
      state.profileUpdateSuccess = false;
      state.error = action.payload;
    })
},
});

export default userSlice.reducer;
