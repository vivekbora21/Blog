import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/blogs")
        .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
        })
        .then((data) => {
        setBlogs(data);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
    }, []);

  return (
    <div className="dash-dashboard">
      <h1 className="dash-dashboard-title">Latest Blogs</h1>

      <div className="dash-blog-grid">
        {blogs.length === 0 ? (
          <p className="dash-no-blogs">No blogs available</p>
        ) : (
          blogs.map((blog) => (
            <div className="dash-blog-card" key={blog.id}>
              {/* Blog Image */}
              {blog.image_url && (
                <img
                  src={`http://localhost:8000${blog.image_url}`}
                  alt={blog.title}
                  className="dash-blog-image"
                />
              )}

              <h2>{blog.title.length > 50 ? blog.title.slice(0, 50) + "..." : blog.title}</h2>
              <p className="dash-blog-meta">
                By {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
              </p>
              <p className="dash-blog-summary">
                {blog.content.length > 120
                  ? blog.content.slice(0, 120) + "..."
                  : blog.content}
              </p>
              <button
                className="dash-read-more-btn"
                onClick={() => navigate(`/blogs/${blog.id}`)}
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

export default Dashboard;
