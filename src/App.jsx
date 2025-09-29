import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Form from './components/Form.jsx';
import LoginForm from './components/LoginForm.jsx';
import AddBlog from './components/AddBlog.jsx';
import Navbar from './components/navbar.jsx';
import Dashboard from './components/dashboard.jsx';
import MyBlogs from './components/MyBlogs.jsx';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/signup" element={<Form />} />
        {/* <Route path="/blogs/:id" element={<BlogDetail />} /> */}
        <Route path="/myblogs" element={<MyBlogs />} />
        <Route path="/addblog" element={<AddBlog />} />
      </Routes>
    </Router>
  )
}

export default App;