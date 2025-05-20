import { useState, useCallback } from "react";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = useCallback(async (isReaction = false) => {
    if (isReaction) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();

      const postsWithComments = await Promise.all(
        (Array.isArray(data) ? data : []).map(async (post) => {
          if (!token) {
            return { ...post, comments: [] };
          }

          try {
            const commentsResponse = await fetch(
              `/api/comments/post/${post.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const comments = commentsResponse.ok
              ? await commentsResponse.json()
              : [];
            return { ...post, comments };
          } catch (error) {
            console.error(
              `Error fetching comments for post ${post.id}:`,
              error
            );
            return { ...post, comments: [] };
          }
        })
      );

      setPosts(postsWithComments);
      return postsWithComments;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    } finally {
      if (isReaction) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const createPost = async (postData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        await fetchPosts();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating post:", error);
      return false;
    }
  };

  return {
    posts,
    isLoading,
    isRefreshing,
    fetchPosts,
    createPost,
  };
};
