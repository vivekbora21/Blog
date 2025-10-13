import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/auth.js';
import "./AddBlog.css";
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000';

const AddBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      navigate('/login', { state: { message: 'Adding a blog requires login. Please log in to continue.' } });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    if (!token) {
      navigate('/login', { state: { message: 'Adding a blog requires login. Please log in to continue.' } });
      return;
    }

    if (title.length > 50) {
      toast.error('Title must be 50 characters or less.');
      return;
    }
    const words = content.trim().split(/\s+/);
    if (words.length > 1000) {
      toast.error('Content must be 1000 words or less.');
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(`Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
        return;
      }
      toast.success('Blog added successfully!');
      setTitle('');
      setContent('');
      setImage(null);
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    }
  };

  return (
    <form className="addblog-form" onSubmit={handleSubmit}>
      <h2>Add New Blog</h2>
      
      <div className="form-group">
        <label htmlFor="title">Blog Title</label>
        <input
          id="title"
          className="title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Blog Content</label>
        <textarea
          id="content"
          className="content-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content here..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Featured Image</label>
        <div className="file-input-wrapper">
          <input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          <label htmlFor="image" className="file-input-label">
            Choose Image File
          </label>
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Publish Blog
      </button>
    </form>
  );
};

export default AddBlog;