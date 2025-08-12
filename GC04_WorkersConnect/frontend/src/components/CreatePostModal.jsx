import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";

const CreatePostModal = ({ isOpen, onClose, userId, fetchPosts }) => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files) {
      const droppedFiles = [...e.dataTransfer.files].filter(file => file.type.startsWith('image/'));
      setImages([...images, ...droppedFiles]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description && images.length === 0) return;
    
    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("description", description);
    formData.append("category_post", category);

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await axios.post("http://localhost:3000/api/create-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setDescription("");
      setImages([]);
      setCategory("");
      onClose();

      // Trigger fetch again to refresh posts
      fetchPosts();
    } catch (err) {
      console.error("Post creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-slate-700 overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-700 p-4">
          <h2 className="text-xl font-semibold text-slate-100">Share Your Thoughts</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={22} className="hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 font-medium text-slate-300 text-sm"
            >
              What's on your mind?
            </label>
            <textarea
              id="description"
              rows="3"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-100 placeholder-slate-400 resize-none transition duration-200"
              placeholder="Share something with the community..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block mb-2 font-medium text-slate-300 text-sm"
            >
              Category
            </label>
            <div className="relative">
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-100 placeholder-slate-400 transition duration-200"
                placeholder="e.g. Plumber, Electrician, Designer..."
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 font-medium text-slate-300 text-sm"
            >
              Media
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center ${dragging ? 'border-blue-400 bg-slate-700/70' : 'border-slate-600 bg-slate-700/30'} transition-all duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <Upload className="text-slate-400 mb-1" size={24} />
                <p className="text-xs text-slate-300 mb-1">Drag images or</p>
                <label className="cursor-pointer inline-flex items-center px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-md text-blue-300 text-xs font-medium transition-colors">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {images.length > 0 && (
                  <p className="text-xs text-slate-400 mt-2">
                    {images.length} file{images.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-700/30 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  <span>Posting...</span>
                </div>
              ) : "Share Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
