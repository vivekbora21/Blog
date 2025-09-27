import React, { useState, useEffect, useRef } from "react";
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

  const refs = formFields.reduce(
    (acc, field) => ({ ...acc, [field.name]: useRef(null) }),
    {}
  );

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        const regex = /^[A-Za-z](?:[A-Za-z]*|[A-Za-z]+(?: [A-Za-z]+)*)$/;
        if (!value || value.trim() === "") {return "Full name is required";}
        if (value.length < 3 || value.length > 50)
          error = "Full Name must be 3-50 characters";
        else if (!regex.test(value))
          error =
            "Only letters and single spaces allowed, must start with an alphabet";
        break;

      case "email":
        if (!value || value.trim() === "") {return "Email is required";}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Invalid email address";
        break;

      case "password":
        if (!value || value.trim() === "") {return "Password is required";}
        if (value.length < 6) error = "Password must be at least 6 characters";
        break;

      case "confirmPassword":
        if (!value || value.trim() === "") {return "Confirm Password is required";}
        if (value !== formData.password) error = "Passwords do not match";
        break;

      case "phone":
        if (!value || value.trim() === "") {return "Phone Number is required";}
        if (!/^\d+$/.test(value)) error = "Phone must be digits only";
        else if (value.length !== 10) error = "Phone number must be 10 digits";
        break;

      case "gender":
        if (!value || value.trim() === "") {return "Gender is required";}
      default:
        break;
    }

    return error;
  };

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
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName" && value.length > 30) return;
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({...prev, [name]: validateField(name, formData[name])}));
  };

  const handleSubmit = (e) => {
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

    alert("Form submitted successfully!");
    console.log(formData);
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
