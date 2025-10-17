import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./blogdetails.css";
import Loader from "./Loader.jsx";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/blogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blog");
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="dashboard">
        <p>Error: {error}</p>
        <button onClick={() => navigate("/")}>Back to Dashboard</button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="dashboard">
        <p>Blog not found</p>
        <button onClick={() => navigate("/")}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        ← Back
      </button>

      <div className="blog-detail">
        <h1 className="blog-title">{blog.title}</h1>
        <p className="blog-meta">
          <span>👤 By {blog.author}</span>
          <span>📅 {new Date(blog.created_at).toLocaleDateString()}</span>
        </p>
        {blog.image_url && (
          <img
            src={`http://localhost:8000${blog.image_url}`}
            alt={blog.title}
            className="blog-image"
          />
        )}
        <div className="blog-content">
          <p>{blog.content}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
