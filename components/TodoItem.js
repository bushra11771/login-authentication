'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTodo, deleteTodo } from '../redux/todoSlice';
import { format } from 'date-fns';

export default function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({ ...todo });
  const [error, setError] = useState('');

  const handleToggleComplete = async () => {
    try {
      await dispatch(updateTodo({
        id: todo._id,
        todoData: { completed: !todo.completed }
      })).unwrap();
    } catch (error) {
      setError(error.message || 'Failed to update todo');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTodo({ ...todo });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateTodo({
        id: todo._id,
        todoData: editedTodo
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      setError(error.message || 'Failed to update todo');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await dispatch(deleteTodo(todo._id)).unwrap();
      } catch (error) {
        setError(error.message || 'Failed to delete todo');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTodo.title}
            onChange={(e) => setEditedTodo({ ...editedTodo, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-medium"
          />
          <textarea
            value={editedTodo.description || ''}
            onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows="2"
          />
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
                className="h-5 w-5 text-blue-600 rounded mr-2"
              />
              <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.title}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
          
          {todo.description && (
            <p className={`text-sm text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}
          
          {todo.dueDate && (
            <p className={`text-xs mt-2 ${new Date(todo.dueDate) < new Date() && !todo.completed ? 'text-red-600' : 'text-gray-500'}`}>
              Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
