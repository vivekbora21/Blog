import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Form from './components/Form.jsx';
import LoginForm from './components/LoginForm.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/signup" element={<Form />} />
      </Routes>
    </Router>
  )
}

export default App;