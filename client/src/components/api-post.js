export const savePosts = (posts) => {
  localStorage.setItem("temannet_posts", JSON.stringify(posts));
};

export const loadPosts = () => {
  return JSON.parse(localStorage.getItem("temannet_posts")) || [];
};