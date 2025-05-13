"use client";

import { useState } from "react";
import Link from "next/link";
import CommentSection from "./CommentSection";

export default function PostCard({ post, onLike }) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isDisliked, setIsDisliked] = useState(post.is_disliked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevDisliked = isDisliked;

    setIsLiked(!prevLiked);
    setIsDisliked(false);
    setLikesCount(prevLiked ? likesCount - 1 : likesCount + 1);
    setDislikesCount(prevDisliked ? dislikesCount - 1 : dislikesCount);

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setIsLiked(prevLiked);
        setIsDisliked(prevDisliked);
        setLikesCount((prev) => (prevLiked ? prev + 1 : prev - 1));
        if (prevDisliked) setDislikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      if (onLike) onLike();
    }
  };

  const handleDislike = async () => {
    const prevDisliked = isDisliked;
    const prevLiked = isLiked;

    setIsDisliked(!prevDisliked);
    setIsLiked(false);
    setDislikesCount(prevDisliked ? dislikesCount - 1 : dislikesCount + 1);
    setLikesCount(prevLiked ? likesCount - 1 : likesCount);

    try {
      const response = await fetch(`/api/posts/${post.id}/dislike`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setIsDisliked(prevDisliked);
        setIsLiked(prevLiked);
        setDislikesCount((prev) => (prevDisliked ? prev + 1 : prev - 1));
        if (prevLiked) setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    } finally {
      if (onLike) onLike();
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      try {
        const response = await fetch(`/api/comments/post/${post.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    setShowComments((prev) => !prev);
  };

  return (
    <article className="border-b border-gray-200 py-8">
      <div className="flex items-center mb-4">
        <span className="text-sm text-gray-500">{post.author.username}</span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-sm text-gray-500">
          {new Date(post.created_at).toLocaleDateString()}
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

        <button
          onClick={handleDislike}
          className={`flex items-center space-x-1 ${
            isDisliked ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <svg
            className="h-5 w-5"
            fill={isDisliked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <span>{dislikesCount}</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4">
          <CommentSection
            postId={post.id}
            comments={comments}
            setComments={setComments}
          />
        </div>
      )}
    </article>
  );
}
