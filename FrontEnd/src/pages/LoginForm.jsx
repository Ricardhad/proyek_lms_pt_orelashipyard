import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:3000/api/user/login", {
        email,
        password,
      });
  
      // Debug log untuk mengecek respons
      console.log("Login Response:", response.data);
  
      localStorage.setItem("token", response.data.token);
      const token = localStorage.getItem("token");

      // Dekode token dan pastikan roleType ada dalam token
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken); // Debug log untuk melihat isi token

      const roleType = decodedToken.roleType;
      console.log("roleType:", roleType); // Debug log untuk memastikan roleType ada dan memiliki nilai yang benar
  
      // Periksa nilai roleType dan arahkan sesuai
      if (roleType === 0) {
        navigate("/home"); // Halaman untuk admin
      } else if (roleType === 1) {
        navigate("/homeMentor"); // Halaman untuk mentor
      } else if (roleType === 2) {
        navigate("/homeMagang"); // Halaman untuk magang
      } else {
        setError("Invalid role type"); // Pesan error jika roleType tidak valid
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Gaya CSS sebagai objek JavaScript
  const style = {
    body: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100%",
      padding: "0 10px",
      backgroundImage: `url("https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTB8fHxlbnwwfHx8fHw%3D")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    },
    wrapper: {
      width: "400px",
      borderRadius: "8px",
      padding: "30px",
      textAlign: "center",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    h2: {
      fontSize: "2rem",
      marginBottom: "20px",
      color: "#fff",
    },
    inputField: {
      position: "relative",
      borderBottom: "2px solid #ccc",
      margin: "15px 0",
    },
    input: {
      width: "100%",
      height: "40px",
      background: "transparent",
      border: "none",
      outline: "none",
      fontSize: "16px",
      color: "#fff",
    },
    label: {
      position: "absolute",
      top: "50%",
      left: "0",
      transform: "translateY(-50%)",
      color: "#fff",
      fontSize: "16px",
      pointerEvents: "none",
      transition: "0.15s ease",
    },
    button: {
      background: "#fff",
      color: "#000",
      fontWeight: "600",
      border: "none",
      padding: "12px 20px",
      cursor: "pointer",
      borderRadius: "3px",
      fontSize: "16px",
      borderColor: "transparent",
      transition: "0.3s ease",
      marginTop: "20px",
    },
    error: {
      color: "red",
      marginBottom: "15px",
    },
    register: {
      textAlign: "center",
      marginTop: "30px",
      color: "#fff",
    },
    link: {
      color: "#efefef",
      textDecoration: "none",
    },
    inputPlaceholder: {
      color: '#fff'
    }
  };

  return (
    <div style={style.body}>
      <style>
        {`
          body::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: url("https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTB8fHxlbnwwfHx8fHw%3D");
            background-position: center;
            background-size: cover;
          }
        `}
      </style>
      <div style={style.wrapper}>
        <form style={style.form} onSubmit={handleSubmit}>
          <h2 style={style.h2}>Login</h2>

          {error && <p style={style.error}>{error}</p>}

          <div style={style.inputField}>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={style.input}
            />
          </div>

          <div style={style.inputField}>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={style.input}
            />
          </div>

          <button type="submit" style={style.button} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div style={style.register}>
            <p>
              Don't have an account? <Link to="/register" style={style.link}>Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
