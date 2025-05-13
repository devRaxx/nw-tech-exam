"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CommentSection from "./CommentSection";

export default function PostCard({ post, onLike }) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isDisliked, setIsDisliked] = useState(post.is_disliked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes_count);
  const [showComments, setShowComments] = useState(false);
  const [hasFetchedComments, setHasFetchedComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);
  const [isUpdating, setIsUpdating] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCurrentUser(data))
        .catch((error) => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          setCurrentUser(null);
        });
    }
  }, [token]);

  const handleUpdate = async () => {
    if (!editedTitle.trim() || !editedBody.trim()) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedTitle,
          body: editedBody,
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        post.title = updatedPost.title;
        post.body = updatedPost.body;
        setIsEditing(false);
      } else {
        const error = await response.json();
        console.error("Error updating post:", error);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsUpdating(false);
    }
  };

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
        setDislikesCount((prev) => (prevDisliked ? prev + 1 : prev - 1));
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
        setLikesCount((prev) => (prevLiked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    } finally {
      if (onLike) onLike();
    }
  };

  const toggleComments = async () => {
    if (!showComments && !hasFetchedComments) {
      setIsLoadingComments(true);
      try {
        const response = await fetch(`/api/comments/post/${post.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setComments(data);
          setHasFetchedComments(true);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    }
    setShowComments((prev) => !prev);
  };

  return (
    <article className="border-b border-gray-200 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">{post.author.username}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()} at{" "}
            {/* My Manual Implementation of Timezone */}
            {new Date(
              new Date(post.created_at).getTime() + 8 * 60 * 60 * 1000
            ).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        {currentUser && currentUser.id === post.author.id && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {isEditing ? "Cancel" : "Edit"}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 text-2xl font-bold text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Post title"
            />
          </div>
          <div>
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Post content"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setEditedTitle(post.title);
                setEditedBody(post.body);
                setIsEditing(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link href={`/posts/${post.id}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-gray-700">
              {post.title}
            </h2>
          </Link>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>
        </>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          disabled={!token}
          className={`flex items-center space-x-1 ${
            isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          } ${!token ? "opacity-50 cursor-not-allowed" : ""}`}
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
          disabled={!token}
          className={`flex items-center space-x-1 ${
            isDisliked ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
          } ${!token ? "opacity-50 cursor-not-allowed" : ""}`}
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
          disabled={!token}
          className={`flex items-center space-x-1 text-gray-500 hover:text-gray-700 ${
            !token ? "opacity-50 cursor-not-allowed" : ""
          }`}
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

      {showComments && token && (
        <div className="mt-4">
          {isLoadingComments ? (
            <p className="text-sm text-gray-500">Loading comments...</p>
          ) : (
            <CommentSection
              postId={post.id}
              comments={comments}
              setComments={setComments}
            />
          )}
        </div>
      )}
    </article>
  );
}
