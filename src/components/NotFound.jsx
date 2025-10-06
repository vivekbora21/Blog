import React from 'react';
import './NotFound.css'; // Assuming you'll add styles

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go back to Home</a>
    </div>
  );
};

export default NotFound;
