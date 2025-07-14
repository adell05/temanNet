import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Navbar({ user }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const count = parseInt(localStorage.getItem("temannet_request_count")) || 0;
      setRequestCount(count);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/profile/${searchTerm}`);
    setSearchTerm("");
  };

  const getPhotoUrl = () => {
    if (!user?.photo) return null;
    return user.photo.startsWith("/uploads")
      ? `http://localhost:5000${user.photo}`
      : `http://localhost:5000/uploads/${user.photo}`;
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("⚠️ This will permanently delete your account. Continue?")) {
      fetch(`http://localhost:5000/api/users/${user._id}`, { method: "DELETE" })
        .then(() => {
          alert("✅ Account deleted successfully.");
          localStorage.clear();
          navigate("/login");
        })
        .catch(() => alert("❌ Failed to delete account."));
    }
  };

  return (
    <>
      <nav
        className="px-4 py-2 shadow-sm d-flex justify-content-between align-items-center sticky-top"
        style={{
          background: "linear-gradient(90deg, #fff7d1, #ffe79b, #fff7d1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="d-flex align-items-center gap-4">
          <span
            className="fw-bold text-dark fs-5"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            <span
              className="rounded-circle d-inline-flex align-items-center justify-content-center me-2"
              style={{
                width: "30px",
                height: "30px",
                background: "linear-gradient(45deg, #f9ca24, #0984e3, #00b894)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              T
            </span>
            TemanNet
          </span>

          <div className="d-none d-md-flex gap-3 text-dark">
            {["home", "friends", "messages", "help"].map((item, idx) => (
              <span
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/${item === "help" ? "help" : item}`)}
              >
                {item === "help" ? "Help Center" : item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 position-relative">
          <form onSubmit={handleSearch} className="d-flex align-items-center bg-white border rounded px-2">
            <i className="bi bi-search text-dark me-2"></i>
            <input
              type="text"
              className="form-control form-control-sm border-0"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "150px" }}
            />
          </form>

          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowNotif(true)}>
            <i
              className="bi bi-bell fs-4"
              style={{
                background: "linear-gradient(45deg, #f9ca24, #0984e3, #00b894)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            ></i>
            {requestCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-6px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  color: "white",
                  fontSize: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px solid white",
                }}
              >
                {requestCount}
              </span>
            )}
          </div>

          <div className="position-relative">
            {getPhotoUrl() ? (
              <img
                src={getPhotoUrl()}
                alt="Profile"
                className="rounded-circle"
                width="40"
                height="40"
                style={{ objectFit: "cover", cursor: "pointer" }}
                onClick={() => setShowDropdown(!showDropdown)}
              />
            ) : (
              <i
                className="bi bi-person-circle fs-3 text-dark"
                style={{ cursor: "pointer" }}
                onClick={() => setShowDropdown(!showDropdown)}
              ></i>
            )}

            {showDropdown && (
              <div
                className="position-absolute end-0 mt-2 p-2 bg-white shadow rounded"
                style={{ minWidth: "150px", zIndex: 1000 }}
              >
                <button
                  className="dropdown-item text-start fw-bold"
                  onClick={() => navigate(`/profile/${user?.name}`)}
                >
                  <i className="bi bi-person me-2"></i> Profile
                </button>
                <button className="dropdown-item text-start text-danger fw-bold" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
                <button className="dropdown-item text-start text-danger fw-bold" onClick={handleDeleteAccount}>
                  <i className="bi bi-trash me-2"></i> Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Modal show={showNotif} onHide={() => setShowNotif(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center text-muted">
            You have {requestCount} pending friend requests.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotif(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
