import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PublicProfile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("temannet_user"));

  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name === currentUser.username) {
      navigate("/profile"); 
      return;
    }
    fetchUser();
  }, [name]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/username/${name}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setUser(data);

      // Tarik followers & following
      const [followersRes, followingRes] = await Promise.all([
        fetch(`http://localhost:5000/api/friends/followers/${data._id}`),
        fetch(`http://localhost:5000/api/friends/following/${data._id}`)
      ]);
      const followersData = await followersRes.json();
      const followingData = await followingRes.json();

      setFollowers(followersData);
      setFollowing(followingData);
    } catch (err) {
      alert(err.message);
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return null;

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", overflowY: "auto" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #fff9c4, #ffe082)",
        padding: "60px 20px 140px 20px",
        position: "relative",
        textAlign: "center",
      }}>
        <h2 className="fw-bold position-absolute" style={{ top: "20px", left: "20px", cursor: "pointer" }} onClick={() => navigate("/home")}>
          TemanNet
        </h2>
        <i className="bi bi-arrow-left-circle-fill text-dark position-absolute" style={{ top: "20px", right: "20px", fontSize: "28px", cursor: "pointer" }} onClick={() => navigate("/home")}></i>

        <div style={{
          position: "absolute",
          left: "50%",
          bottom: "-60px",
          transform: "translateX(-50%)",
        }}>
          {user.photo ? (
            <img src={`http://localhost:5000${user.photo}`} alt="Profile" className="rounded-circle" style={{ width: "130px", height: "130px", objectFit: "cover" }} />
          ) : (
            <i className="bi bi-person-circle text-secondary" style={{ fontSize: "130px" }}></i>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="container text-center" style={{ marginTop: "70px", maxWidth: "600px", paddingBottom: "100px" }}>
        <h3 className="fw-bold">{user.name || user.username}</h3>
        <p className="text-muted">@{user.username}</p>
        <p className="text-secondary">{user.description || "No description yet."}</p>

        <div className="d-flex justify-content-center gap-4 mt-4">
          <div>
            <h5 className="fw-bold mb-0">{user.friends?.length || 0}</h5>
            <small className="text-muted">Friends</small>
          </div>
          <div>
            <h5 className="fw-bold mb-0">{followers.length}</h5>
            <small className="text-muted">Followers</small>
          </div>
          <div>
            <h5 className="fw-bold mb-0">{following.length}</h5>
            <small className="text-muted">Following</small>
          </div>
        </div>
      </div>
    </div>
  );
}
