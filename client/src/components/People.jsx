// src/components/People.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function People({
  title,
  people = [],
  followStatus = {},
  onToggleFollow,
  showFollowButton = true,
}) {
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm p-3 mt-3" style={{ backgroundColor: "#fff3cd" }}>
      <h5 className="mb-3 fw-bold">{title}</h5>

      {people.length === 0 ? (
        <p className="text-muted">No data available.</p>
      ) : (
        people.map((person, idx) => (
          <div key={person._id || idx} className="d-flex align-items-center justify-content-between mb-2">
            <div
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${person.username}`)}
            >
              <i className="bi bi-person-circle fs-4 me-2"></i>
              <span className="fw-bold">{person.username}</span>
              {person.verified && <i className="bi bi-patch-check-fill text-primary ms-2"></i>}
            </div>

            {showFollowButton && (
              <button
                className={`btn btn-sm ${
                  followStatus[person.username] ? "btn-danger" : "btn-outline-primary"
                }`}
                onClick={() => onToggleFollow(person)}
              >
                {followStatus[person.username] ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
