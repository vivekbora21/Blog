import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/auth.js';
import "./Dashboard.css";
import { toast } from 'react-toastify';

const MyBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = () => {
    const token = getCookie("token");
    if (!token) {
      navigate('/login');
      return;
    }
    fetch("http://localhost:8000/myblogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
        .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
        })
        .then((data) => {
        console.log("Fetched my blogs:", data);
        setBlogs(data);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    const token = getCookie("token");
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(`Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
        return;
      }
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">My Blogs</h1>

      <div className="blog-grid">
        {blogs.length === 0 ? (
          <p className="no-blogs">No blogs available</p>
        ) : (
          blogs.map((blog) => (
            <div className="blog-card" key={blog.id}>
              <h2>{blog.title}</h2>
              <p className="blog-meta">
                By {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
              </p>
              <p className="blog-summary">
                {blog.content.length > 150
                  ? blog.content.slice(0, 150) + "..."
                  : blog.content}
              </p>
              <button
                className="read-more-btn"
                onClick={() => navigate(`/blogs/${blog.id}`)}
              >
                Read More
              </button>
              <div className="button-container">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/editblog/${blog.id}`)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
