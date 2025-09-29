import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/auth.js';
import "./Dashboard.css";

const MyBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
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
    }, []);

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
                onClick={() => alert(`Navigate to blog ${blog.id}`)}
              >
                Read More
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
