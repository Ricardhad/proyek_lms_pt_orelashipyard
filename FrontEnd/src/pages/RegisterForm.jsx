import React from "react";
import { Link } from "react-router-dom";
import "../style.css";

const Register = () => {
  return (
    <div className="wrapper">
      <form>
        <h2>Register</h2>
        <div className="input-field">
          <input type="text" required />
          <label>Enter your username</label>
        </div>
        <div className="input-field">
          <input type="email" required />
          <label>Enter your email</label>
        </div>
        <div className="input-field">
          <input type="password" required />
          <label>Create your password</label>
        </div>
        <div className="input-field">
          <input type="password" required />
          <label>Confirm your password</label>
        </div>
        <button type="submit">Register</button>
        <div className="register">
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
