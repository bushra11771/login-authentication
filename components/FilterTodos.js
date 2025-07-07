'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters, selectCategories, selectTags } from '../redux/todoSlice';

export default function FilterTodos() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const tags = useSelector(selectTags);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    category: '',
    tag: '',
    completed: null,
  });

  useEffect(() => {
    // Debounce the filter updates
    const timer = setTimeout(() => {
      dispatch(setFilter(localFilters));
    }, 300);

    return () => clearTimeout(timer);
  }, [localFilters, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      search: '',
      category: '',
      tag: '',
      completed: null,
    });
    dispatch(resetFilters());
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-medium">Filter Todos</h3>
      
      <div>
        <label htmlFor="search" className="block text-sm text-gray-700 mb-1">Search</label>
        <input
          type="text"
          id="search"
          name="search"
          value={localFilters.search}
          onChange={handleChange}
          placeholder="Search todos..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={localFilters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="tag" className="block text-sm text-gray-700 mb-1">Tag</label>
          <select
            id="tag"
            name="tag"
            value={localFilters.tag}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="completed"
          name="completed"
          checked={localFilters.completed === true}
          onChange={() => setLocalFilters(prev => ({
            ...prev,
            completed: prev.completed === true ? null : true
          }))}
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label htmlFor="completed" className="ml-2 text-sm text-gray-700">
          Show completed only
        </label>
      </div>
      
      <button
        onClick={handleReset}
        className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
      >
        Reset Filters
      </button>
    </div>
  );
}