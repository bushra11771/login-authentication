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

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;

      const response = await axios.post('/api/todos', todoData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: err.message });
    }
  }
);

// export const addTodo = createAsyncThunk(
//   'todos/addTodo',
//   async (todoData, { getState, rejectWithValue }) => {
//     try {
//       const { auth } = getState(); // Get the current Redux state
//       const token = auth?.token; // Extract token from auth state

//       const response = await axios.post('/api/todos', todoData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}` 
//         },
//       });
//       return response.data;
//     } catch (err) {
//       // Error handling remains the same
//       if (err.response) {
//         return rejectWithValue(err.response.data);
//       }
//       return rejectWithValue({ message: err.message });
//     }
//   }
// );


export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, todoData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/todos/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
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

export default todoSlice.reducer;

// Selectors
export const selectAllTodos = (state) => state.todos.items;
export const selectTodoStatus = (state) => state.todos.status;
export const selectTodoError = (state) => state.todos.error;