"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/userSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [name, setName] = useState(user?.name || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture ? `/uploads/${user.profilePicture}` : null);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (profilePicture) formData.append('profilePicture', profilePicture);
    dispatch(updateProfile(formData));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Profile</h2>
      
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <label className="text-sm font-medium text-gray-700 self-start">
            Profile Picture:
          </label>
          
          {/* Profile Picture Preview */}
          {preview && (
            <div className="relative">
              <img 
                src={preview} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />
            </div>
          )}
          
          {/* File Input */}
          <div className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        {/* Name Input Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your name"
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;