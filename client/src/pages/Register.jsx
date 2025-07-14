import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import tutImg from "../assets/tut.jpg";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      if (res.status === 201) {
        alert("✅ Registration successful! Silakan login.");
        navigate("/login");
      } else {
        alert("❌ Terjadi kesalahan saat registrasi.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed!";
      alert("❌ " + errorMsg);
    }
  };

  const getButtonStyle = (path) => ({
    padding: "6px 18px",
    backgroundColor:
      location.pathname === path || hovered === path ? "#ffcc00" : "#e0e0e0",
    color:
      location.pathname === path || hovered === path ? "#000" : "#444",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "0.2s ease",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Segoe UI" }}>
      <div
        style={{
          flex: 1,
          backgroundImage: `url(${tutImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "32px", color: "#ffffff" }}>Welcome</h2>
        <p style={{ maxWidth: "80%" }}>
          Join now and start sharing your stories with TemanNet.
        </p>
      </div>

      <div style={{ flex: 1, padding: "40px", backgroundColor: "#f4f4f4", color: "#333" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={() => navigate("/login")}
            onMouseEnter={() => setHovered("/login")}
            onMouseLeave={() => setHovered("")}
            style={getButtonStyle("/login")}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            onMouseEnter={() => setHovered("/register")}
            onMouseLeave={() => setHovered("")}
            style={getButtonStyle("/register")}
          >
            Sign Up
          </button>
        </div>

        <h3 style={{ marginTop: "30px", color: "#222" }}>Create an Account</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              style={{ width: "100%", padding: "10px", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px", color: "#333" }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              style={{ width: "100%", padding: "10px", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px", color: "#333" }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              style={{ width: "100%", padding: "10px", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px", color: "#333" }}
              required
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#ffcc00", color: "#000", border: "none", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}>
            Sign Up
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} style={{ color: "#ffcc00", cursor: "pointer", textDecoration: "underline" }}>
              Sign In here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
