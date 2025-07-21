"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromStorage, logout } from '../redux/authSlice';
import { fetchTodos, addTodo, updateTodo, deleteTodo, selectAllTodos, selectTodoStatus, selectTodoError } from '../redux/todoSlice';
import ProtectedRoute from '../app/ProtectedRoute';

const initialTodoState = { title: '', description: '', date: '' };

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const todos = useSelector(selectAllTodos);
  const todoStatus = useSelector(selectTodoStatus);
  const todoError = useSelector(selectTodoError);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [todoForm, setTodoForm] = useState(initialTodoState);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchTodos(user._id));
    }
  }, [dispatch, user?._id]);

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== "undefined") {
      window.location.href = '/login';
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setTodoForm(initialTodoState);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (todo) => {
    setModalMode('edit');
    setTodoForm({ title: todo.title, description: todo.description, date: todo.date });
    setEditId(todo._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTodoForm(initialTodoState);
    setEditId(null);
  };

  const handleFormChange = (e) => {
    setTodoForm({ ...todoForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      dispatch(addTodo({ ...todoForm, userId: user._id })).then((res) => {
        if (!res.error) closeModal();
      });
    } else if (modalMode === 'edit' && editId) {
      dispatch(updateTodo({ id: editId, todoData: { ...todoForm, userId: user._id } })).then((res) => {
        if (!res.error) closeModal();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      dispatch(deleteTodo(id));
    }
  };

  // Only show todos for the logged-in user
  const userTodos = todos.filter((todo) => todo.userId === user?._id);

  if (authLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (authError) {
    return <div>Error: {authError}</div>;
  }

  return (
    <ProtectedRoute requiredRole="Customer">
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl">🏠</span>
                <h1 className="ml-2 text-xl font-bold text-gray-900">ServiceHub</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.name || user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Todos</h2>
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              + Add Todo
            </button>
          </div>
          {todoStatus === 'loading' && <div>Loading todos...</div>}
          {todoError && <div className="text-red-500">{todoError}</div>}
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userTodos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">No todos found.</td>
                </tr>
              ) : (
                userTodos.map((todo) => (
                  <tr key={todo._id} className="border-t">
                    <td className="py-2 px-4 border">{todo.title}</td>
                    <td className="py-2 px-4 border">{todo.description}</td>
                    <td className="py-2 px-4 border">{todo.date}</td>
                    <td className="py-2 px-4 border flex gap-2 justify-center">
                      <button
                        onClick={() => openEditModal(todo)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Modal for Add/Edit Todo */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                title="Close"
              >
                ×
              </button>
              <h3 className="text-lg font-bold mb-4">{modalMode === 'add' ? 'Add Todo' : 'Edit Todo'}</h3>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={todoForm.title}
                  onChange={handleFormChange}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={todoForm.description}
                  onChange={handleFormChange}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={todoForm.date}
                  onChange={handleFormChange}
                  className="border p-2 rounded"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                  disabled={todoStatus === 'loading'}
                >
                  {todoStatus === 'loading' ? 'Saving...' : 'Save'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default CustomerDashboard;