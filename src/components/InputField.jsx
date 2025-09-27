import React from "react";

const InputField = ({label, name, type = "text", value, onChange, onBlur, error, maxLength, inputRef, options, isTextarea = false, groupClass = "form-group", errorClass = "error", required = true }) => {
  return (
    <div className={groupClass}>
      <label>{label} {required && <span className="required-star">*</span>}</label>

      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={inputRef}
          style={{ height: "38px", resize: "none" }}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={inputRef}
        >
          <option value="">Select {label}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          ref={inputRef}
        />
      )}

      {error && <span className={errorClass}>{error}</span>}
    </div>
  );
};

export default InputField;
