'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTodo, deleteTodo } from '../redux/todoSlice';
import { format } from 'date-fns';

export default function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({ 
    ...todo,
    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
  });
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (editedTodo.imageUrl && editedTodo.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(editedTodo.imageUrl);
      }
    };
  }, [editedTodo.imageUrl]);

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
    setEditedTodo({ 
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      // Create preview URL while waiting for upload
      const previewUrl = URL.createObjectURL(file);
      setEditedTodo(prev => ({ ...prev, imageUrl: previewUrl }));
    } catch (err) {
      setError('Failed to create image preview');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (editedTodo.imageUrl && editedTodo.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(editedTodo.imageUrl);
    }
    setEditedTodo({ ...editedTodo, imageUrl: '' });
  };

  const handleSave = async () => {
  setIsSaving(true);
  setError('');

  try {
    let payload;
    let isFormData = false;

    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      isFormData = true;
      const file = fileInputRef.current.files[0];
      payload = new FormData();
      payload.append('title', editedTodo.title);
      payload.append('description', editedTodo.description);
      payload.append('dueDate', editedTodo.dueDate);
      payload.append('image', file);
    } else {
      payload = {
        title: editedTodo.title,
        description: editedTodo.description,
        dueDate: editedTodo.dueDate,
      };
    }

    await dispatch(updateTodo({
      id: todo._id,
      todoData: payload,
      isFormData
    })).unwrap();

    setIsEditing(false);
  } catch (error) {
    setError(error.message || 'Failed to save todo');
  } finally {
    setIsSaving(false);
  }
};

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteTodo(todo._id)).unwrap();
      setShowDeleteModal(false);
    } catch (error) {
      setError(error.message || 'Failed to delete todo');
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 relative">
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
            placeholder="Todo title"
          />
          <textarea
            value={editedTodo.description || ''}
            onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows="2"
            placeholder="Description (optional)"
          />
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={editedTodo.dueDate || ''}
              onChange={(e) => setEditedTodo({ ...editedTodo, dueDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Image upload section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Image
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            
            <div className="flex flex-col items-center space-y-3">
              {editedTodo.imageUrl ? (
                <>
                  <img
                    src={editedTodo.imageUrl}
                    alt="Preview"
                    className="max-h-40 max-w-full rounded-md object-contain border border-gray-200"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Change Image'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-center mt-1">No image selected</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Select Image'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isUploading || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
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
                onClick={handleDeleteClick}
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
          
          {todo.imageUrl && (
            <div className="mt-3 border border-gray-200 rounded-lg p-2">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Attached Image:</h4>
              <img 
                src={todo.imageUrl} 
                alt="Task attachment" 
                className="max-h-48 w-full object-contain rounded-md"
              />
            </div>
          )}
          
          {todo.dueDate && (
            <p className={`text-xs mt-2 ${new Date(todo.dueDate) < new Date() && !todo.completed ? 'text-red-600' : 'text-gray-500'}`}>
              Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
            </p>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this todo?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}