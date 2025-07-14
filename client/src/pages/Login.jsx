import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import tutImg from "../assets/tut.jpg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");

      // Simpan data user ke localStorage
      localStorage.setItem(
        "temannet_user",
        JSON.stringify({
          _id: data.user._id,
          name: data.user.name,
          username: data.user.username,
          email: data.user.email,
          photo: data.user.photo || "",
        })
      );

      // Ambil jumlah friend request
      const reqRes = await fetch(`http://localhost:5000/api/users/requests/${data.user._id}`);
      const reqData = await reqRes.json();
      localStorage.setItem("temannet_request_count", reqData.length || 0);

      alert("✅ Login successful!");
      navigate("/home", { replace: true });
    } catch (err) {
      alert("❌ " + err.message);
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
          Login now and continue building connections with TemanNet.
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

        <h3 style={{ marginTop: "30px", color: "#222" }}>Sign in to your account</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                color: "#333",
              }}
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
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                color: "#333",
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#ffcc00",
              color: "#000",
              fontWeight: "bold",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#ffcc00",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign Up here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
