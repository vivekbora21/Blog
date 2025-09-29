import { Link, useNavigate } from "react-router-dom";
import { getCookie, deleteCookie } from "../utils/auth.js";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = getCookie("token");

  const handleLogout = (e) => {
    e.preventDefault();
    deleteCookie('token');
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {token ? (
        <>
          <Link to="/myblogs">My Blogs</Link>
          <Link to="/addblog">Add Blog</Link>
          <Link to="/login" onClick={handleLogout}>Logout</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;