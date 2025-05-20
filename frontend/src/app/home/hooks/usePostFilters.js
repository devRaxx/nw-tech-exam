import { useState, useMemo } from "react";

export const usePostFilters = (posts, user) => {
  const [activeFilter, setActiveFilter] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      );
    }

    switch (activeFilter) {
      case "recent":
        return filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "popular":
        return filtered.sort((a, b) => b.likes_count - a.likes_count);
      case "my-posts":
        return user
          ? filtered.filter((post) => post.author_id === user.id)
          : filtered;
      default:
        return filtered;
    }
  }, [posts, searchQuery, activeFilter, user]);

  return {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredPosts,
  };
};
