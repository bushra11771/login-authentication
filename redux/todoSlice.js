import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../components/api';
import axios from 'axios';
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/todos?userId=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAllTodos = createAsyncThunk(
  'todos/fetchAllTodos',
  async (_userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.get('/api/todos/all', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
console.log('todoData:', todoData);
      // Use FormData for file uploads if needed
      const formData = new FormData();
      formData.append('title', todoData.title);
      formData.append('description', todoData.description || '');
      if (todoData.dueDate) formData.append('dueDate', todoData.dueDate);
      if (todoData.image) formData.append('image', todoData.image);

      const response = await axios.post('/api/todos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      // The backend should handle sending the email notification
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: err.message });
    }
  }
);
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, todoData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.put(`/api/todos/${id}`, todoData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.delete(`/api/todos/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastAddedTodo: null // Track the last added todo for notifications
  },
  reducers: {
    clearLastAddedTodo: (state) => {
      state.lastAddedTodo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch todos';
      })
      .addCase(addTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [...state.items, action.payload];
        state.lastAddedTodo = action.payload; // Store the last added todo
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add todo';
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(todo => todo._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => todo._id !== action.payload);
      });
  },
});

export const { clearLastAddedTodo } = todoSlice.actions;
export default todoSlice.reducer;

// Selectors
export const selectAllTodos = (state) => state.todos.items;
export const selectTodoStatus = (state) => state.todos.status;
export const selectTodoError = (state) => state.todos.error;
export const selectLastAddedTodo = (state) => state.todos.lastAddedTodo;