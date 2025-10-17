import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/auth.js";
import "./MyBlogs.css";
import { toast } from "react-toastify";

const MyBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch user's blogs
  const fetchBlogs = () => {
    const token = getCookie("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("http://localhost:8000/myblogs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched my blogs:", data);
        setBlogs(data);
        setFilteredBlogs(data);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    const token = getCookie("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(
          `Error: ${response.status} - ${errorData.detail || "Unknown error"}`
        );
        return;
      }

      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, blogs]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm("");

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="my-myblogs">
      {/* === Header with Title + Search === */}
      <div className="my-myblogs-header">
        <h1 className="my-myblogs-title">My Blogs</h1>

        <div className="my-search-container">
          <div className="my-search-wrapper">
            <input
              type="text"
              className="my-search-input"
              placeholder="Search your blogs..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button className="my-search-clear" onClick={clearSearch}>
                ✕
              </button>
            )}
            <span className="my-search-icon">🔍</span>
          </div>
        </div>
      </div>

      {/* === Blog List === */}
      <div className="my-blog-list">
        {currentBlogs.length === 0 ? (
          <p className="my-no-myblogs">
            {searchTerm
              ? `No blogs found for "${searchTerm}"`
              : "No blogs available"}
          </p>
        ) : (
          currentBlogs.map((blog) => (
            <div className="my-blog-row" key={blog.id}>
              <div className="my-blog-info">
                <h2>
                  {blog.title.length > 50
                    ? blog.title.slice(0, 50) + "..."
                    : blog.title}
                </h2>
                <p className="my-blog-meta">
                  By {blog.author} •{" "}
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>
                <p className="my-blog-summary">
                  {blog.content.length > 120
                    ? blog.content.slice(0, 120) + "..."
                    : blog.content}
                </p>
                <button
                  className="my-read-more-btn"
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                >
                  Read
                </button>
              </div>

              <div className="my-button-container">
                <button
                  className="my-edit-btn"
                  onClick={() => navigate(`/editblog/${blog.id}`)}
                >
                  Update
                </button>
                <button
                  className="my-delete-btn"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="my-pagination">
          <button
            className="my-page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`my-page-btn ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="my-page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
