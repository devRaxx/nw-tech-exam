"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import CommentSection from "./CommentSection";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function PostCard({ post, onLike, currentUser }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isDisliked, setIsDisliked] = useState(post.is_disliked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes_count);
  const [showComments, setShowComments] = useState(false);
  const [hasFetchedComments, setHasFetchedComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const token = useMemo(
    () =>
      typeof window !== "undefined" ? localStorage.getItem("token") : null,
    []
  );

  const canEdit = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.id === post.author.id;
  }, [currentUser, post.author.id]);

  const handleAuthAction = useCallback(
    (action) => {
      if (!token) {
        router.push("/login");
        return false;
      }
      return true;
    },
    [token, router]
  );

  const handleUpdate = useCallback(async () => {
    if (!handleAuthAction("edit")) return;
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
  }, [editedTitle, editedBody, post, token, handleAuthAction]);

  const handleLike = useCallback(async () => {
    if (!handleAuthAction("like")) return;

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
        throw new Error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      if (onLike) onLike();
    }
  }, [
    isLiked,
    isDisliked,
    likesCount,
    dislikesCount,
    post.id,
    token,
    onLike,
    handleAuthAction,
  ]);

  const handleDislike = useCallback(async () => {
    if (!handleAuthAction("dislike")) return;

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
        throw new Error("Failed to dislike post");
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    } finally {
      if (onLike) onLike();
    }
  }, [
    isDisliked,
    isLiked,
    dislikesCount,
    likesCount,
    post.id,
    token,
    onLike,
    handleAuthAction,
  ]);

  const toggleComments = useCallback(async () => {
    if (!handleAuthAction("comment")) return;

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
  }, [showComments, hasFetchedComments, post.id, token, handleAuthAction]);

  const refreshComments = useCallback(async () => {
    if (!token) return;

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
      console.error("Error refreshing comments:", error);
    }
  }, [post.id, token]);

  useEffect(() => {
    if (showComments) {
      refreshComments();
    }
  }, [post.likes_count, post.dislikes_count, showComments, refreshComments]);

  const handleDelete = useCallback(async () => {
    if (!handleAuthAction("delete")) return;

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (onLike) onLike();
      } else {
        const error = await response.json();
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  }, [post.id, token, onLike, handleAuthAction]);

  const formattedDate = useMemo(() => {
    const date = new Date(post.created_at);
    return {
      date: date.toLocaleDateString(),
      time: new Date(date.getTime() + 8 * 60 * 60 * 1000).toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
        }
      ),
    };
  }, [post.created_at]);

  return (
    <article className="border-b border-gray-200 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">{post.author.username}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {formattedDate.date} at {formattedDate.time}
          </span>
        </div>
        {canEdit && (
          <div className="flex space-x-2">
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
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {post.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>
        </>
      )}

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
          {isLoadingComments ? (
            <p className="text-sm text-gray-500">Loading comments...</p>
          ) : (
            <CommentSection
              postId={post.id}
              comments={comments}
              setComments={setComments}
              onCommentUpdate={refreshComments}
            />
          )}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDelete();
          setShowDeleteModal(false);
        }}
      />
    </article>
  );
}
