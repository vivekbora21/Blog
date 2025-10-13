import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>BlogApp</h3>
          <p>Your go-to platform for sharing and discovering amazing blogs.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/myblogs">My Blogs</a></li>
            <li><a href="/addblog">Add Blog</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: bloginfo@blogapp.com</p>
          <p>Phone: +919927916049</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="Instagram">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 BlogApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
