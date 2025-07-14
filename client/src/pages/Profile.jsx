import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";

export default function Profile() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("temannet_user"));

  const [photo, setPhoto] = useState(userData?.photo ? `http://localhost:5000${userData.photo}` : null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(userData?.name || userData?.username || "Name");
  const [description, setDescription] = useState(userData?.description || "Hi there! Welcome to my profile.");
  const [tempName, setTempName] = useState(name);
  const [tempDescription, setTempDescription] = useState(description);
  const [showEditModal, setShowEditModal] = useState(false);

  const [activeTab, setActiveTab] = useState("posts");
  const [allPosts, setAllPosts] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem(`temannet_posts_${userData._id}`)) || [];
    setAllPosts(savedPosts);

    fetch(`http://localhost:5000/api/users/following/${userData._id}`)
      .then(res => res.json())
      .then(data => setFollowingList(data))
      .catch(() => setFollowingList([]));

    fetch(`http://localhost:5000/api/users/followers/${userData._id}`)
      .then(res => res.json())
      .then(data => setFollowersList(data))
      .catch(() => setFollowersList([]));
  }, [userData._id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedPhoto(file);
  };

  const handleUpload = async () => {
    if (!selectedPhoto) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("photo", selectedPhoto);

    try {
      const res = await fetch(`http://localhost:5000/api/users/photo/${userData._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload photo");

      alert("✅ Profile photo updated successfully!");
      const updatedUser = { ...userData, photo: data.photo };
      localStorage.setItem("temannet_user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = () => {
    setName(tempName);
    setDescription(tempDescription);
    setShowEditModal(false);

    const updatedUser = { ...userData, name: tempName, description: tempDescription };
    localStorage.setItem("temannet_user", JSON.stringify(updatedUser));
  };

  const updatePostsStorage = (updatedPosts) => {
    setAllPosts(updatedPosts);
    localStorage.setItem(`temannet_posts_${userData._id}`, JSON.stringify(updatedPosts));
  };

  const handleLikePost = (postId) => {
    const updatedPosts = allPosts.map((p) =>
      p.id === postId
        ? {
            ...p,
            likes: p.likes.includes(userData.username)
              ? p.likes.filter((u) => u !== userData.username)
              : [...p.likes, userData.username],
          }
        : p
    );
    updatePostsStorage(updatedPosts);
  };

  const handleSavePost = (postId) => {
    const updatedPosts = allPosts.map((p) =>
      p.id === postId
        ? {
            ...p,
            savedBy: p.savedBy?.includes(userData.username)
              ? p.savedBy.filter((u) => u !== userData.username)
              : [...(p.savedBy || []), userData.username],
          }
        : p
    );
    updatePostsStorage(updatedPosts);
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const updatedPosts = allPosts.filter((p) => p.id !== postId);
    updatePostsStorage(updatedPosts);
  };

  const renderTabContent = () => {
    let filteredPosts = [];

    if (activeTab === "posts") {
      filteredPosts = allPosts.filter((p) => p.username === userData.username);
    } else if (activeTab === "liked") {
      filteredPosts = allPosts.filter((p) => p.likes.includes(userData.username));
    } else if (activeTab === "saved") {
      filteredPosts = allPosts.filter((p) => p.savedBy?.includes(userData.username));
    } else if (activeTab === "tagged") {
      filteredPosts = allPosts.filter((p) => p.tagged?.includes(userData.username));
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="text-center text-muted mt-4">
          <i className="bi bi-camera fs-1"></i>
          <h6 className="mt-3 fw-bold">
            {activeTab === "posts"
              ? "No posts to display"
              : activeTab === "liked"
              ? "You haven't liked any posts yet"
              : activeTab === "saved"
              ? "You haven't saved any posts yet"
              : "No tagged posts yet"}
          </h6>
          {activeTab === "posts" && (
            <button className="btn btn-warning text-dark fw-bold mt-3" onClick={() => navigate("/home")}>
              <i className="bi bi-plus-circle me-2"></i> Create Post
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="mt-4 text-start">
        {filteredPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            user={userData}
            onLike={handleLikePost}
            onSave={handleSavePost}
            onDelete={handleDeletePost}
            onComment={() => {}}
            onEdit={() => {}}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", overflowY: "auto" }}>
      <div style={{
        background: "linear-gradient(90deg, #fff9c4, #ffe082)",
        padding: "60px 20px 140px 20px",
        position: "relative",
        textAlign: "center"
      }}>
        <h2 className="fw-bold position-absolute" style={{ top: "20px", left: "20px", cursor: "pointer" }} onClick={() => navigate("/home")}>
          TemanNet
        </h2>
        <i className="bi bi-arrow-left-circle-fill text-dark position-absolute" style={{ top: "20px", right: "20px", fontSize: "28px", cursor: "pointer" }} onClick={() => navigate("/home")}></i>

        <div style={{
          position: "absolute",
          left: "50%",
          bottom: "-60px",
          transform: "translateX(-50%)"
        }}>
          {photo
            ? <img src={photo} alt="Profile" className="rounded-circle" style={{ width: "130px", height: "130px", objectFit: "cover" }} />
            : <i className="bi bi-person-circle text-secondary" style={{ fontSize: "130px" }}></i>
          }
        </div>
      </div>

      <div className="container text-center" style={{ marginTop: "70px", maxWidth: "600px", paddingBottom: "100px" }}>
        <h3 className="fw-bold">{name}</h3>
        <p className="text-muted">@{userData.username}</p>
        <p className="text-secondary">{description}</p>

        <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <label className="btn btn-warning text-dark fw-bold">
            <i className="bi bi-camera me-2"></i> Change Photo
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </label>

          <button className="btn btn-warning text-dark fw-bold" onClick={() => {
            setTempName(name);
            setTempDescription(description);
            setShowEditModal(true);
          }}>
            <i className="bi bi-pencil me-2"></i> Edit Profile
          </button>

          {selectedPhoto && (
            <button className="btn btn-success fw-bold" onClick={handleUpload} disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>

        <div className="d-flex justify-content-center gap-4 mt-4">
          <div>
            <h5 className="fw-bold mb-0">{allPosts.filter((p) => p.username === userData.username).length}</h5>
            <small className="text-muted">Posts</small>
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => setShowFollowingModal(true)}>
            <h5 className="fw-bold mb-0">{followingList.length}</h5>
            <small className="text-muted">Following</small>
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => setShowFollowersModal(true)}>
            <h5 className="fw-bold mb-0">{followersList.length}</h5>
            <small className="text-muted">Followers</small>
          </div>
        </div>

        <div className="d-flex justify-content-between border-bottom mt-4">
          {["posts", "liked", "saved", "tagged"].map((tab) => (
            <div key={tab} className={`pb-2 flex-fill text-center ${activeTab === tab ? "border-bottom border-primary text-primary fw-bold" : "text-muted"}`}
              style={{ cursor: "pointer" }} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {renderTabContent()}
      </div>

      {showEditModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "400px", width: "100%" }}>
            <h5 className="fw-bold mb-3">Edit Profile</h5>
            <div className="mb-3 text-start">
              <label className="form-label fw-bold">Name</label>
              <input type="text" className="form-control" value={tempName} onChange={(e) => setTempName(e.target.value)} />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control" rows="3" value={tempDescription} onChange={(e) => setTempDescription(e.target.value)}></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-warning text-dark fw-bold" onClick={handleSaveProfile}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "400px", width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
            <h5 className="fw-bold mb-3">Following</h5>
            {followingList.length === 0 ? (
              <p className="text-muted">You are not following anyone yet.</p>
            ) : (
              <ul className="list-group">
                {followingList.map((user) => (
                  <li key={user.username} className="list-group-item d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${user.username}`)}>
                    <i className="bi bi-person-circle fs-5 me-2"></i>
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-secondary" onClick={() => setShowFollowingModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showFollowersModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "400px", width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
            <h5 className="fw-bold mb-3">Followers</h5>
            {followersList.length === 0 ? (
              <p className="text-muted">You have no followers yet.</p>
            ) : (
              <ul className="list-group">
                {followersList.map((user) => (
                  <li key={user.username} className="list-group-item d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${user.username}`)}>
                    <i className="bi bi-person-circle fs-5 me-2"></i>
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-secondary" onClick={() => setShowFollowersModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}