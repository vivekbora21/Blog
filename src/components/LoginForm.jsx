import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/auth.js';
import InputField from "./InputField";
import "./LoginForm.css";
import { toast } from 'react-toastify';

const loginFields = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
];

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    loginFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const refs = {
    email: emailRef,
    password: passwordRef,
  };

  const validateField = useCallback((name, value) => {
    let error = "";

    switch (name) {
      case "email": {
        if (!value || value.trim() === "") {
          error = "Email is required";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = "Invalid email address";
          }
        }
        break;
      }

      case "password": {
        if (!value || value.trim() === "") {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      }

      default:
        break;
    }

    return error;
  }, []);

  useEffect(() => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (touched[key]) {
        newErrors[key] = validateField(key, formData[key]);
      } else {
        newErrors[key] = "";
      }
    });
    setErrors(newErrors);
  }, [formData, touched, validateField]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({...prev, [name]: validateField(name, formData[name])}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};
    Object.keys(formData).forEach((key) => {formErrors[key] = validateField(key, formData[key]);
    });
    setErrors(formErrors);

    const firstErrorField = Object.keys(formErrors).find((key) => formErrors[key]);
    if (firstErrorField) {
      refs[firstErrorField].current.focus();
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCookie('token', data.access_token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        const errorData = await response.json();
        toast.error(`Login failed: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <form className="independent-login-form" onSubmit={handleSubmit}>
      <h1>Login</h1>

      <div className="independent-login-form-grid one-column">
        {loginFields.map((field) => (
          <InputField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name]}
            onChange={handleChange}
            onBlur={() => handleBlur(field.name)}
            error={errors[field.name]}
            inputRef={refs[field.name]}
            groupClass="independent-login-form-group"
            errorClass="independent-login-error"
          />
        ))}
        <div className="independent-login-actions">
        <span className="independent-forgot-password"
          onClick={() => navigate("/forgot-password")}>Forgot password?
        </span>
      </div>
      </div>
      <button type="submit" className="independent-login-submit-btn">Login</button>
      <div className="independent-login-footer">
        Don’t have an account?{" "}
        <span className="independent-login-link" onClick={() => navigate("/signup")}>
          Sign up
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
