import { Link, useNavigate } from "react-router-dom";
import { getCookie, deleteCookie } from "../utils/auth.js";
import { useAuth } from "../utils/AuthContext.jsx";
import "./navbar.css";
import Loader from "./Loader.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setLoading(true);
    // Simulate logout delay or actual logout process
    setTimeout(() => {
      deleteCookie('token');
      logout(); // Update auth state
      navigate('/login');
      setLoading(false);
    }, 1000); // Adjust delay as needed
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {loading && <Loader />}
      <nav>
        <div className="navbar-left">
          <Link to="/" className="blog-title">Blog</Link>
        </div>
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/myblogs">My Blogs</Link>
              <Link to="/addblog">Add Blog</Link>
            <Link to="/login" onClick={handleLogoutClick}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/addblog">Add Blog</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        message="Are you sure you want to logout?"
      />
    </>
  );
};

export default Navbar;