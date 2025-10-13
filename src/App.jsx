import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Form from './components/Form.jsx';
import LoginForm from './components/LoginForm.jsx';
import AddBlog from './components/AddBlog.jsx';
import EditBlog from './components/EditBlog.jsx';
import Navbar from './components/navbar.jsx';
import Dashboard from './components/dashboard.jsx';
import MyBlogs from './components/MyBlogs.jsx';
import BlogDetail from './components/BlogDetail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx';
import { AuthProvider } from './utils/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './components/forgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import NotFound from './components/NotFound.jsx';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginForm /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><Form /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
          <Route path="/reset-password" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
          <Route path="/myblogs" element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />
          <Route path="/addblog" element={<ProtectedRoute><AddBlog /></ProtectedRoute>} />
          <Route path="/editblog/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  )
}

export default App;