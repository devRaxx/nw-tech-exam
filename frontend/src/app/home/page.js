"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import CreatePostModal from "../components/CreatePostModal";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }
          return res.json();
        })
        .then((data) => setUser(data))
        .catch((error) => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          setUser(null);
        });
    }

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      console.log("Fetched posts:", data);
      setPosts(Array.isArray(data) ? data : []);
      setFilteredPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    let filtered = [...posts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      );
    }

    if (activeFilter === "recent") {
      filtered.sort(
        (a, b) => new Date(b.posted_date) - new Date(a.posted_date)
      );
    } else {
      filtered.sort((a, b) => b.likes_count - a.likes_count);
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, activeFilter]);

  const handleCreatePost = async (postData) => {
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
        fetchPosts();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {user && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create Post
            </button>
          )}
        </div>

        <SearchBar onSearch={setSearchQuery} />

        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onLike={fetchPosts} />
          ))}
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </main>
  );
}
