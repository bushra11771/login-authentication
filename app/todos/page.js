'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, selectAllTodos, selectTodoStatus, selectTodoError } from '../../redux/todoSlice';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../ProtectedRoute';
import TodoForm from '@app/components/TodoForm';
import TodoItem from '@app/components/TodoItem';

export default function TodosPage() {
  const dispatch = useDispatch();
  const todos = useSelector(selectAllTodos);
  const status = useSelector(selectTodoStatus);
  const error = useSelector(selectTodoError);
  const {user} = useSelector((state) => state.auth);
  const router = useRouter();
  
 

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={() => {dispatch(logout())
                 localStorage.removeItem('token');
                 localStorage.removeItem('user');
                  router.push('/login');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <TodoForm />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {status === 'loading' && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {status === 'failed' && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                  <p>{error}</p>
                </div>
              )}
              
              {status === 'succeeded' && (
                <div className="space-y-4">
                  {todos.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                      <p className="text-gray-500">No todos found. Add a new todo to get started!</p>
                    </div>
                  ) : (
                    todos.map((todo) => (
                      <TodoItem key={todo._id} todo={todo} />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}