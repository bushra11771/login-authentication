import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice';
import todoReducer from "../redux/todoSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer, 
  },
});

export default store; 