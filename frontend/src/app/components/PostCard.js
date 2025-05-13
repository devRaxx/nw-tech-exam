"use client";

import { useState } from "react";
import Link from "next/link";

export default function PostCard({ post, onLike }) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/v1/posts/${post.id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        if (onLike) onLike();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <article className="border-b border-gray-200 py-8">
      <div className="flex items-center mb-4">
        <span className="text-sm text-gray-500">{post.author.username}</span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-sm text-gray-500">
          {new Date(post.posted_date).toLocaleDateString()}
        </span>
      </div>

      <Link href={`/posts/${post.id}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-gray-700">
          {post.title}
        </h2>
      </Link>

      <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
        >
          <svg
            className="h-5 w-5"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likesCount}</span>
        </button>
      </div>
    </article>
  );
}
