import React, { useState, useEffect, useRef, useCallback } from "react";
import InputField from "./InputField";
import "./Form.css";
import { useNavigate } from 'react-router-dom';

const formFields = [
  { name: "fullName", label: "Full Name", type: "text", maxLength: 50 },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
  { name: "gender", label: "Gender", type: "select", options: [
      { value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" },],},
  { name: "phone", label: "Phone Number", type: "text", maxLength: 10 },
];

const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const genderRef = useRef(null);
  const phoneRef = useRef(null);

  const refs = {
    fullName: fullNameRef,
    email: emailRef,
    password: passwordRef,
    confirmPassword: confirmPasswordRef,
    gender: genderRef,
    phone: phoneRef,
  };

  const validateField = useCallback((name, value) => {
    let error = "";

    switch (name) {
      case "fullName": {
        if (!value || value.trim() === "") {
          error = "Full name is required";
        } else {
          const regex = /^[A-Za-z](?:[A-Za-z]*|[A-Za-z]+(?: [A-Za-z]+)*)$/;
          if (value.length < 3 || value.length > 50) {
            error = "Full Name must be 3-50 characters";
          } else if (!regex.test(value)) {
            error = "Only letters and single spaces allowed, must start with an alphabet";
          }
        }
        break;
      }

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

      case "confirmPassword": {
        if (!value || value.trim() === "") {
          error = "Confirm Password is required";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      }

      case "phone": {
        if (!value || value.trim() === "") {
          error = "Phone Number is required";
        } else {
          if (!/^\d+$/.test(value)) {
            error = "Phone must be digits only";
          } else if (value.length !== 10) {
            error = "Phone number must be 10 digits";
          }
        }
        break;
      }

      case "gender": {
        if (!value || value.trim() === "") {
          error = "Gender is required";
        }
        break;
      }

      default:
        break;
    }

    return error;
  }, [formData]);

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

    if (name === "fullName" && value.length > 50) return;
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred during signup.");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Register</h1>

      <div className="form-grid two-columns">
        {formFields.map((field) => (
          <InputField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type === "textarea" ? "text" : field.type}
            value={formData[field.name]}
            onChange={handleChange}
            onBlur={() => handleBlur(field.name)}
            error={errors[field.name]}
            maxLength={field.maxLength}
            inputRef={refs[field.name]}
            options={field.options}
            isTextarea={field.type === "textarea"}
          />
        ))}
      </div>

      <button type="submit" className="submit-btn">
        Submit
      </button>
      <div className="signup-footer">
        Aready have an account?{" "}
        <span className="signup-link" onClick={() => navigate("/login")}>
          Login
        </span>
      </div>
    </form>
  );
};

export default Form;
