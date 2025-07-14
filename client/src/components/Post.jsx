import React, { useEffect, useState } from "react";

export default function Post({ post, user, onDelete, onEdit, onLike, onComment, onSave }) {
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsLiked(post.likes.includes(user.username));
    setIsSaved(post.savedBy?.includes(user.username));
  }, [post, user.username]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    const newComment = {
      id: Date.now(),
      username: user.username,
      text: commentText,
    };

    onComment(post.id, newComment);
    setCommentText("");
  };

  const handleLikeClick = () => {
    onLike(post.id);
    setIsLiked(!isLiked);
  };

  const handleSaveClick = () => {
    onSave(post.id);
    setIsSaved(!isSaved);
  };

  const handleShare = (type) => {
    alert(`Post shared to ${type}`);
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return "";
    return photo.startsWith("/")
      ? `http://localhost:5000${photo}`
      : `http://localhost:5000/uploads/${photo}`;
  };

  return (
    <div className="card mb-3 shadow-sm">
      {/* Header */}
      <div className="d-flex align-items-center p-3 border-bottom">
        {post.photo ? (
          <img
            src={getPhotoUrl(post.photo)}
            alt="avatar"
            className="rounded-circle me-2"
            width="40"
            height="40"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <i className="bi bi-person-circle fs-2 me-2"></i>
        )}
        <div>
          <strong style={{ color: "#0d6efd" }}>{post.username}</strong>
        </div>

        <div className="dropdown ms-auto">
          <button className="btn btn-sm" data-bs-toggle="dropdown">
            <i className="bi bi-three-dots"></i>
          </button>
          <ul className="dropdown-menu">
            <li>
              <span className="dropdown-item" onClick={handleSaveClick}>
                <i className={`bi ${isSaved ? "bi-bookmark-fill" : "bi-bookmark"} me-2`}></i>
                {isSaved ? "Saved" : "Save"}
              </span>
            </li>
            {post.username === user.username && (
              <>
                <li>
                  <span className="dropdown-item" onClick={() => onEdit(post)}>
                    <i className="bi bi-pencil-square me-2"></i> Edit
                  </span>
                </li>
                <li>
                  <span className="dropdown-item text-danger" onClick={() => onDelete(post.id)}>
                    <i className="bi bi-trash me-2"></i> Delete
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Caption & Media */}
      <div className="p-3">
        <p>{post.caption}</p>
        {post.imagePreview && (
          <img src={post.imagePreview} alt="Post" className="img-fluid rounded mb-2" />
        )}
        {post.attachmentName && (
          <p className="mb-2">
            <i className="bi bi-paperclip me-1"></i> {post.attachmentName}
          </p>
        )}
        {post.audioUrl && (
          <div className="mb-2">
            <audio controls src={post.audioUrl} />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="d-flex align-items-center px-3 pb-2 border-top">
        <div
          className="d-flex align-items-center me-3"
          style={{ cursor: "pointer", color: isLiked ? "red" : "orange" }}
          onClick={handleLikeClick}
          title="Like"
        >
          <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"} me-1`}></i> {post.likes.length}
        </div>

        <div className="d-flex align-items-center me-3" style={{ color: "orange" }} title="Comment">
          <i className="bi bi-chat me-1"></i> {post.comments.length}
        </div>

        <div className="dropdown">
          <button
            className="btn btn-sm"
            data-bs-toggle="dropdown"
            style={{ color: "orange" }}
            title="Share"
          >
            <i className="bi bi-send"></i>
          </button>
          <ul className="dropdown-menu">
            <li>
              <span className="dropdown-item" onClick={() => handleShare("Friends")}>Share to Friends</span>
            </li>
            <li>
              <span className="dropdown-item" onClick={() => handleShare("Groups")}>Share to Groups</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Timestamp */}
      <div className="px-3 text-muted mb-2" style={{ fontSize: "0.8rem" }}>
        Posted: {new Date(post.id).toLocaleString("en-US")}
      </div>

      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="px-3 pt-2">
          {post.comments.map((cmt) => (
            <div key={cmt.id} className="mb-2">
              <strong style={{ color: "#0d6efd" }}>{cmt.username}:</strong> {cmt.text}
            </div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      <form className="d-flex align-items-center gap-2 px-3 pb-3 mt-2" onSubmit={handleCommentSubmit}>
        {user.photo ? (
          <img
            src={getPhotoUrl(user.photo)}
            alt="Me"
            className="rounded-circle"
            width="35"
            height="35"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <i className="bi bi-person-circle fs-4"></i>
        )}
        <input
          className="form-control"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="btn btn-sm btn-warning text-dark fw-bold">Send</button>
      </form>
    </div>
  );
}
