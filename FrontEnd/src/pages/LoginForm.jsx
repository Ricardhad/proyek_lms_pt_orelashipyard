import React from "react";
import { Link } from "react-router-dom";
import "../style.css";

const Login = () => {
  return (
    <div className="wrapper">
      <form>
        <h2>Login</h2>
        <div className="input-field">
          <input type="text" required />
          <label>Enter your email</label>
        </div>
        <div className="input-field">
          <input type="password" required />
          <label>Enter your password</label>
        </div>
        <div className="forget">
          <label>
            <input type="checkbox" />
            <p>Remember me</p>
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit">Log In</button>
        <div className="register">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
