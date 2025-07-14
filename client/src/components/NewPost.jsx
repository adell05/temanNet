import React, { useState } from "react";

export default function NewPost({ onPost }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [feeling, setFeeling] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption && !image && !feeling) return;

    onPost(caption, image, feeling);
    setCaption("");
    setImage(null);
    setFeeling("");
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">Create Post</h5>
        <form onSubmit={handleSubmit}>
          <textarea className="form-control mb-2" rows="2" placeholder="What's on your mind?" value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>

          <div className="d-flex gap-2 mb-3">
            <label className="btn btn-sm" style={{ backgroundColor: "#d6d6d6", color: "black" }}>
              <i className="bi bi-image-fill me-1"></i> Photo/Video
              <input type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
            </label>

            <div className="dropdown">
              <button className="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" style={{ backgroundColor: "#d6d6d6", color: "black" }}>
                <i className="bi bi-emoji-smile me-1"></i> Feeling
              </button>
              <ul className="dropdown-menu">
                <li><span className="dropdown-item" onClick={() => setFeeling("😊")}>😊 Happy</span></li>
                <li><span className="dropdown-item" onClick={() => setFeeling("😢")}>😢 Sad</span></li>
                <li><span className="dropdown-item" onClick={() => setFeeling("😡")}>😡 Angry</span></li>
                <li><span className="dropdown-item" onClick={() => setFeeling("😲")}>😲 Surprised</span></li>
              </ul>
            </div>
          </div>

          <button type="submit" className="btn btn-warning text-dark w-100 fw-bold">
            <i className="bi bi-send-fill me-2"></i> Post
          </button>
        </form>
      </div>
    </div>
  );
}