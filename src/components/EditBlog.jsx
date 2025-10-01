import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../utils/auth.js';
import "./AddBlog.css";
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000';

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${API_URL}/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blog");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setExistingImage(data.image_url);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        toast.error("Failed to load blog for editing");
        navigate('/myblogs');
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    if (!token) {
      navigate('/login');
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: "PUT",
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
      toast.success('Blog updated successfully!');
      navigate('/myblogs');
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="dashboard"><p>Loading...</p></div>;
  }

  return (
    <form className="addblog-form" onSubmit={handleSubmit}>
      <h2>Edit Blog</h2>

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
        {existingImage && (
          <div>
            <p>Current Image:</p>
            <img src={`${API_URL}${existingImage}`} alt="Current" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </div>
        )}
        <div className="file-input-wrapper">
          <input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          <label htmlFor="image" className="file-input-label">
            Choose New Image File (leave empty to keep current)
          </label>
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Update Blog
      </button>
    </form>
  );
};

export default EditBlog;
