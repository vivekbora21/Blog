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
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './components/forgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import NotFound from './components/NotFound.jsx';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/signup" element={<Form />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/myblogs" element={<MyBlogs />} />
        <Route path="/addblog" element={<AddBlog />} />
        <Route path="/editblog/:id" element={<EditBlog />} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path="*" element={<NotFound />} />  
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App;