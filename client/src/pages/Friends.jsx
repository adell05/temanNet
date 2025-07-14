import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Friends() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [suggestions, setSuggestions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("temannet_user"));
    if (!userData) {
      navigate("/login");
    } else {
      setUser(userData);
      fetchAll(userData._id);
    }
  }, [navigate]);

  const fetchAll = async (userId) => {
    try {
      const [sugRes, conRes, reqRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/users/suggestions/${userId}`),
        axios.get(`http://localhost:5000/api/users/friends/${userId}`),
        axios.get(`http://localhost:5000/api/users/requests/${userId}`),
      ]);
      setSuggestions(sugRes.data);
      setContacts(conRes.data);
      setRequests(reqRes.data);
      localStorage.setItem("temannet_request_count", reqRes.data.length);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleFollow = async (person) => {
    try {
      await axios.post("http://localhost:5000/api/users/send-request", {
        from: user._id,
        to: person._id,
      });
      fetchAll(user._id);
    } catch (err) {
      console.error("Error sending follow request:", err);
    }
  };

  const handleAcceptRequest = async (person) => {
    try {
      await axios.post("http://localhost:5000/api/users/accept-request", {
        from: person._id,
        to: user._id,
      });
      fetchAll(user._id);
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleDeclineRequest = async (person) => {
    try {
      await axios.post("http://localhost:5000/api/users/decline-request", {
        from: person._id,
        to: user._id,
      });
      fetchAll(user._id);
    } catch (err) {
      console.error("Error declining request:", err);
    }
  };

  const handleRemoveFriend = async (person) => {
    try {
      await axios.post("http://localhost:5000/api/users/remove-friend", {
        userId: user._id,
        friendId: person._id,
      });
      fetchAll(user._id);
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  const tabStyle = (tab) => ({
    cursor: "pointer",
    backgroundColor: activeTab === tab ? "#ffc107" : "transparent",
    color: activeTab === tab ? "#000" : "#ffc107",
    fontWeight: "bold",
    borderRadius: "5px",
    padding: "8px 16px",
    marginRight: "10px",
    border: "1px solid #ffc107",
    position: "relative",
    display: "inline-block",
  });

  const renderUserItem = (person, actionButton) => (
    <div key={person._id} className="d-flex justify-content-between align-items-center border p-2 rounded mb-2">
      <div className="d-flex align-items-center">
        {person.photo ? (
          <img
            src={`http://localhost:5000${person.photo}`}
            alt="profile"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
        ) : (
          <i className="bi bi-person-circle" style={{ fontSize: "35px", color: "#ccc", marginRight: "10px" }}></i>
        )}
        <span style={{ color: "#007bff", fontWeight: "500" }}>{person.username}</span>
      </div>
      {actionButton}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar user={user} />

      <div className="container mt-4" style={{ paddingBottom: "100px" }}>
        <div
          className="shadow-sm"
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "20px",
            minHeight: "80vh",
          }}
        >
          <h5 className="mb-3 fw-bold">Find Friends</h5>

          <div className="d-flex mb-4">
            <span style={tabStyle("suggestions")} onClick={() => setActiveTab("suggestions")}>
              Suggestions
            </span>
            <span style={tabStyle("contacts")} onClick={() => setActiveTab("contacts")}>
              Contacts
            </span>
            <span style={tabStyle("requests")} onClick={() => setActiveTab("requests")}>
              Requests
              {requests.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    color: "white",
                    fontSize: "11px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px solid white",
                  }}
                >
                  {requests.length}
                </span>
              )}
            </span>
          </div>

          {activeTab === "suggestions" && (
            suggestions.length === 0 ? (
              <p className="text-center text-muted">No Suggestions Yet</p>
            ) : (
              suggestions.map((person) =>
                renderUserItem(
                  person,
                  <button className="btn btn-warning btn-sm" onClick={() => handleFollow(person)}>
                    Follow
                  </button>
                )
              )
            )
          )}

          {activeTab === "contacts" && (
            contacts.length === 0 ? (
              <p className="text-center text-muted">No Contacts Yet</p>
            ) : (
              contacts.map((person) =>
                renderUserItem(
                  person,
                  <button className="btn btn-secondary btn-sm" onClick={() => handleRemoveFriend(person)}>
                    Unfollow
                  </button>
                )
              )
            )
          )}

          {activeTab === "requests" && (
            requests.length === 0 ? (
              <p className="text-center text-muted">No Friend Requests Yet</p>
            ) : (
              requests.map((person) =>
                renderUserItem(
                  person,
                  <div>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleAcceptRequest(person)}>
                      Accept
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleDeclineRequest(person)}>
                      Decline
                    </button>
                  </div>
                )
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
