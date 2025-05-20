"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import CreatePostModal from "../components/CreatePostModal";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { usePostFilters } from "@/hooks/usePostFilters";

export default function HomePage() {
  const { user } = useAuth();
  const { posts, isLoading, fetchPosts, createPost } = usePosts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredPosts,
  } = usePostFilters(posts, user);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (postData) => {
    const success = await createPost(postData);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  const renderPosts = () => {
    if (isLoading) {
      return Array(3)
        .fill()
        .map((_, i) => <PostSkeleton key={i} />);
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? "No posts found matching your search."
              : activeFilter === "my-posts"
              ? "You haven't created any posts yet."
              : "No posts available."}
          </p>
        </div>
      );
    }

    return filteredPosts.map((post) => (
      <PostCard
        key={post.id}
        post={post}
        onLike={() => fetchPosts(true)}
        currentUser={user}
      />
    ));
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            user={user}
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

        <div className="space-y-8">{renderPosts()}</div>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </main>
  );
}
