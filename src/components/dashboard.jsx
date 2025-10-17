import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader.jsx";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        setBlogs(data);
        setFilteredBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, blogs]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm("");

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dash-dashboard">
      <div className="dash-dashboard-header">
        <h1 className="dash-dashboard-title">Latest Blogs</h1>
        <div className="dash-search-container">
          <div className="dash-search-wrapper">
            <input
              type="text"
              placeholder="Search your blogs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="dash-search-input"
            />
            {searchTerm && (
              <button className="dash-search-clear" onClick={clearSearch}>
                ✕
              </button>
            )}
            <span className="dash-search-icon">🔍</span>
          </div>
          {searchTerm && (
            <p className="dash-search-results">
              Found {filteredBlogs.length} blog
              {filteredBlogs.length !== 1 ? "s" : ""} for “{searchTerm}”
            </p>
          )}
        </div>
      </div>

      <div className="dash-blog-grid">
        {currentBlogs.length === 0 ? (
          <div className="dash-no-blogs">
            {searchTerm ? (
              <div className="dash-no-results">
                <p>No blogs found for “{searchTerm}”</p>
                <button
                  className="dash-clear-search-btn dash-read-more-btn"
                  onClick={clearSearch}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <p>No blogs available</p>
            )}
          </div>
        ) : (
          currentBlogs.map((blog) => (
            <div className="dash-blog-card" key={blog.id}>
              {blog.image_url && (
                <img
                  src={`http://localhost:8000${blog.image_url}`}
                  alt={blog.title}
                  className="dash-blog-image"
                />
              )}

              <h2>
                {blog.title.length > 50
                  ? blog.title.slice(0, 50) + "..."
                  : blog.title}
              </h2>

              <p className="dash-blog-meta">
                By {blog.author} •{" "}
                {new Date(blog.created_at).toLocaleDateString()}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="dash-pagination">
          <button
            className="dash-page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`dash-page-btn ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="dash-page-btn"
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

export default Dashboard;
