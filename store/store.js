import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice';
import todoReducer from "../redux/todoSlice"
import userReducer from '../redux/userSlice';   

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
     users: userReducer,
    
  },
});

export default store; 