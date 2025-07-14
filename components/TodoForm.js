'use client';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '../redux/todoSlice';


export default function TodoForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const user = useSelector(state => state.auth?.user || state.user);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }; 

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!title.trim()) {
    setError('Title is required');
    return;
  }

  if (!user) {
    setError('User not authenticated');
    return;
  }

  setIsUploading(true);
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (dueDate) formData.append('dueDate', dueDate);
    if (imageFile) formData.append('image', imageFile);
    
    // Add removeImage flag if image was removed
    if (!imagePreview && fileInputRef.current?.value === '') {
      formData.append('removeImage', 'true');
    }

    const result = await dispatch(
      addTodo(formData)
    ).unwrap();

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } catch (error) {
    console.error('Error:', error);
    setError(error.message || 'Failed to add todo');
  } finally {
    setIsUploading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Todo</h2>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter todo title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Enter todo description"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={new Date().toISOString().split('T')[0]}
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
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
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

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Todo
      </button>
    </form>
  );
}