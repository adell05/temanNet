import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Post from "../components/Post";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [feeling, setFeeling] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [followStatus, setFollowStatus] = useState({
    "Jungkook BTS": false,
    "Taehyung BTS": false,
    "Jhope BTS": false,
  });

  const getPhotoUrl = (photo) => {
    if (!photo) return "";
    return photo.startsWith("/") 
      ? `http://localhost:5000${photo}` 
      : `http://localhost:5000/uploads/${photo}`;
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("temannet_user"));
    if (!userData) return navigate("/login");
    setUser(userData);

    const savedPosts = JSON.parse(localStorage.getItem(`temannet_posts_${userData._id}`)) || [];
    setPosts(savedPosts);

    const savedFollow = JSON.parse(localStorage.getItem(`temannet_follow_${userData._id}`));
    if (savedFollow) setFollowStatus(savedFollow);
  }, [navigate]);

  const updatePostsStorage = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem(`temannet_posts_${user._id}`, JSON.stringify(updatedPosts));
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!caption && !image && !feeling && !attachment && !audioBlob) return;

    const newCaption = caption + (feeling ? ` ${feeling}` : "");

    if (editingPostId) {
      const updatedPosts = posts.map((p) =>
        p.id === editingPostId
          ? {
              ...p,
              caption: newCaption,
              imagePreview: image ? URL.createObjectURL(image) : p.imagePreview,
              imageFile: image ? image.name : p.imageFile,
              attachmentName: attachment ? attachment.name : p.attachmentName,
              audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : p.audioUrl,
            }
          : p
      );
      updatePostsStorage(updatedPosts);
      setEditingPostId(null);
    } else {
      const newPost = {
        id: Date.now(),
        username: user.username,
        photo: user.photo || null,
        caption: newCaption,
        imagePreview: image ? URL.createObjectURL(image) : null,
        imageFile: image ? image.name : null,
        attachmentName: attachment ? attachment.name : null,
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
        likes: [],
        comments: [],
        savedBy: [],
      };
      updatePostsStorage([newPost, ...posts]);
    }

    setCaption("");
    setImage(null);
    setAttachment(null);
    setAudioBlob(null);
    setFeeling("");
  };

  const handleDeletePost = (postId) => {
    updatePostsStorage(posts.filter((p) => p.id !== postId));
  };

  const handleEditPost = (postData) => {
    setCaption(postData.caption);
    setImage(null);
    setAttachment(null);
    setAudioBlob(null);
    setFeeling("");
    setEditingPostId(postData.id);
  };

  const handleLikePost = (postId) => {
    const updatedPosts = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            likes: p.likes.includes(user.username)
              ? p.likes.filter((u) => u !== user.username)
              : [...p.likes, user.username],
          }
        : p
    );
    updatePostsStorage(updatedPosts);
  };

  const handleCommentPost = (postId, commentData) => {
    const updatedPosts = posts.map((p) =>
      p.id === postId ? { ...p, comments: [...p.comments, commentData] } : p
    );
    updatePostsStorage(updatedPosts);
  };

  const handleSavePost = (postId) => {
    const updatedPosts = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            savedBy: p.savedBy.includes(user.username)
              ? p.savedBy.filter((u) => u !== user.username)
              : [...p.savedBy, user.username],
          }
        : p
    );
    updatePostsStorage(updatedPosts);
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(`http://localhost:5000/api/users/photo/${user._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload photo");

      const updatedUser = { ...user, photo: data.photo };
      setUser(updatedUser);
      localStorage.setItem("temannet_user", JSON.stringify(updatedUser));

      const updatedPosts = posts.map((p) => ({
        ...p,
        photo: data.photo,
      }));
      updatePostsStorage(updatedPosts);

      alert("✅ Profile photo updated!");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file);
  };

  const handleStartRecording = () => {
    if (!navigator.mediaDevices) {
      alert("Your device does not support audio recording");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        setRecording(true);

        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => setAudioBlob(new Blob(chunks, { type: "audio/webm" }));
      })
      .catch(() => alert("Failed to access microphone"));
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleFollowToggle = (person) => {
    setFollowStatus((prev) => {
      const updated = { ...prev, [person]: !prev[person] };
      localStorage.setItem(`temannet_follow_${user._id}`, JSON.stringify(updated));
      return updated;
    });
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar user={user} />

      <div className="container mt-4">
        <div className="row gx-3">
          
          {/* Left Sidebar */}
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm p-3 d-flex flex-column align-items-center justify-content-center text-center" style={{ backgroundColor: "#f0f0f0", minHeight: "250px" }}>
              {user.photo ? (
                <img
                  src={getPhotoUrl(user.photo)}
                  alt="Profile"
                  className="rounded-circle mb-2"
                  width="100"
                  height="100"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <i className="bi bi-person-circle fs-1 mb-2"></i>
              )}
              <h5 className="mb-1">{user.username}</h5>
              <small className="text-muted">TemanNet User</small>
              <label className="btn btn-sm mt-3 text-white" style={{ backgroundColor: "#6c757d" }}>
                <i className="bi bi-camera-fill me-1"></i> Change Photo
                <input type="file" accept="image/*" hidden onChange={handleChangePhoto} />
              </label>
            </div>
          </div>

          {/* Center Feed */}
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">{editingPostId ? "Edit Your Post" : "Create a New Post"}</h5>
                <form onSubmit={handlePost}>
                  <textarea
                    className="form-control mb-2"
                    rows="2"
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  ></textarea>

                  {image && (
                    <div className="mb-2">
                      <img src={URL.createObjectURL(image)} alt="Preview" className="img-fluid rounded" />
                    </div>
                  )}

                  {attachment && (
                    <div className="mb-2 text-muted">
                      📎 {attachment.name}
                    </div>
                  )}

                  {audioBlob && (
                    <div className="mb-2">
                      <audio controls src={URL.createObjectURL(audioBlob)}></audio>
                    </div>
                  )}

                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    <label className="btn btn-sm text-white" style={{ backgroundColor: "#6c757d" }}>
                      <i className="bi bi-image-fill me-1"></i> Photo/Video
                      <input type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
                    </label>

                    <label className="btn btn-sm text-white" style={{ backgroundColor: "#6c757d" }}>
                      <i className="bi bi-paperclip me-1"></i> Attachment
                      <input type="file" hidden onChange={handleAttachment} />
                    </label>

                    {recording ? (
                      <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "red" }} onClick={handleStopRecording}>
                        <i className="bi bi-stop-circle me-1"></i> Stop
                      </button>
                    ) : (
                      <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "#6c757d" }} onClick={handleStartRecording}>
                        <i className="bi bi-mic-fill me-1"></i> Audio
                      </button>
                    )}

                    <div className="dropdown">
                      <button className="btn btn-sm dropdown-toggle text-white" type="button" data-bs-toggle="dropdown" style={{ backgroundColor: "#6c757d" }}>
                        <i className="bi bi-emoji-smile me-1"></i> Feeling
                      </button>
                      <ul className="dropdown-menu">
                        {["😊 Happy", "😢 Sad", "😡 Angry", "😲 Surprised"].map((f) => (
                          <li key={f}>
                            <span className="dropdown-item" onClick={() => setFeeling(f.split(" ")[0])}>
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-warning text-dark w-100 fw-bold">
                    <i className="bi bi-send-fill me-2"></i> {editingPostId ? "Update" : "Post"}
                  </button>
                </form>
              </div>
            </div>

            {posts.length === 0 ? (
              <p className="text-center text-muted">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  user={user}
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
                  onLike={handleLikePost}
                  onComment={handleCommentPost}
                  onSave={handleSavePost}
                />
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm p-3" style={{ backgroundColor: "#e2e3e5" }}>
              <h5 className="mb-3">Trending Topics</h5>
              <ul className="list-unstyled">
                <li>#EventBatam</li>
                <li>#UMKMIndonesia</li>
                <li>#Teknologi2025</li>
                <li>#CashTrackr</li>
              </ul>
            </div>

            <div className="card shadow-sm p-3 mt-3" style={{ backgroundColor: "#fff3cd" }}>
              <h5 className="mb-3">People You May Know</h5>
              {["Jungkook BTS", "Taehyung BTS", "Jhope BTS"].map((person, idx) => (
                <div className="d-flex align-items-center justify-content-between mb-2" key={idx}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle fs-4 me-2"></i>
                    <span>{person}</span>
                    <i className="bi bi-patch-check-fill text-primary ms-2"></i>
                  </div>
                  <button
                    className={`btn btn-sm ${followStatus[person] ? "btn-danger" : "btn-outline-primary"}`}
                    onClick={() => handleFollowToggle(person)}
                  >
                    {followStatus[person] ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}