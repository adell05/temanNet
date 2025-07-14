import React from "react";
import Post from "./Post";

export default function PostList({ posts, onDelete }) {
  if (posts.length === 0) {
    return <p className="text-center text-muted">No posts yet.</p>;
  }
  return posts.map((post) => <Post key={post.id} post={post} onDelete={onDelete} />);
}

// 4. src/components/post/Comments.jsx
import React from "react";

export default function Comments() {
  return (
    <div className="d-flex align-items-center px-3 pb-3">
      <i className="bi bi-person-circle fs-4 me-2"></i>
      <input className="form-control" placeholder="Write something ..." disabled />
    </div>
  );
}