import { Link, useNavigate } from "react-router-dom";
import { getCookie, deleteCookie } from "../utils/auth.js";
import { useAuth } from "../utils/AuthContext.jsx";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    deleteCookie('token');
    logout(); // Update auth state
    navigate('/login');
  };

  return (
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
            <Link to="/login" onClick={handleLogout}>Logout</Link>
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
  );
};

export default Navbar;