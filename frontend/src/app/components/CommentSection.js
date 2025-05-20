"use client";

import { useState, useCallback, memo } from "react";

const CommentItem = memo(
  ({
    comment,
    onLike,
    onDislike,
    onReply,
    replyingTo,
    replyContent,
    onReplySubmit,
    onReplyCancel,
    onReplyContentChange,
  }) => (
    <div className="border-l-2 border-gray-200 pl-4 mb-4">
      <div className="flex items-center mb-2">
        <span className="text-sm font-medium text-gray-900">
          {comment.author.username}
        </span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-sm text-gray-500">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-700 mb-2">{comment.content}</p>

      <div className="flex items-center space-x-4 mb-2">
        <button
          onClick={() => onLike(comment.id)}
          className={`flex items-center space-x-1 ${
            comment.is_liked
              ? "text-red-500"
              : "text-gray-500 hover:text-red-500"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill={comment.is_liked ? "currentColor" : "none"}
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
          <span>{comment.likes_count}</span>
        </button>

        <button
          onClick={() => onDislike(comment.id)}
          className={`flex items-center space-x-1 ${
            comment.is_disliked
              ? "text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill={comment.is_disliked ? "currentColor" : "none"}
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
          <span>{comment.dislikes_count}</span>
        </button>

        <button
          onClick={() => onReply(comment.id)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Reply
        </button>
      </div>

      {replyingTo === comment.id && (
        <form onSubmit={(e) => onReplySubmit(e, comment.id)} className="mb-4">
          <textarea
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            rows={2}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={onReplyCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm text-white bg-gray-900 rounded-md hover:bg-gray-800"
            >
              Reply
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onDislike={onDislike}
              onReply={onReply}
              replyingTo={replyingTo}
              replyContent={replyContent}
              onReplySubmit={onReplySubmit}
              onReplyCancel={onReplyCancel}
              onReplyContentChange={onReplyContentChange}
            />
          ))}
        </div>
      )}
    </div>
  )
);

CommentItem.displayName = "CommentItem";

function updateCommentTree(comments, updatedComment) {
  return comments.map((comment) => {
    if (comment.id === updatedComment.id) {
      return {
        ...comment,
        ...updatedComment,
        replies: comment.replies || [],
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentTree(comment.replies, updatedComment),
      };
    }
    return comment;
  });
}

export default function CommentSection({
  postId,
  comments,
  setComments,
  onCommentUpdate,
}) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmitComment = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;

      try {
        const response = await fetch(`/api/comments/post/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        });

        if (response.ok) {
          const comment = await response.json();
          setComments((prevComments) => [...prevComments, comment]);
          setNewComment("");
          if (onCommentUpdate) onCommentUpdate();
        }
      } catch (error) {
        console.error("Error creating comment:", error);
      }
    },
    [newComment, postId, token, setComments, onCommentUpdate]
  );

  const handleSubmitReply = useCallback(
    async (e, parentId) => {
      e.preventDefault();
      if (!replyContent.trim()) return;

      try {
        const response = await fetch(`/api/comments/post/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: replyContent,
            parent_id: parentId,
          }),
        });

        if (response.ok) {
          const reply = await response.json();
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === parentId
                ? { ...comment, replies: [...(comment.replies || []), reply] }
                : comment
            )
          );
          setReplyContent("");
          setReplyingTo(null);
          if (onCommentUpdate) onCommentUpdate();
        }
      } catch (error) {
        console.error("Error creating reply:", error);
      }
    },
    [replyContent, postId, token, setComments, onCommentUpdate]
  );

  const handleLikeComment = useCallback(
    async (commentId) => {
      try {
        const response = await fetch(`/api/comments/${commentId}/like`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const updatedComment = await response.json();
          setComments((prevComments) =>
            updateCommentTree(prevComments, updatedComment)
          );
          if (onCommentUpdate) onCommentUpdate();
        }
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    },
    [token, setComments, onCommentUpdate]
  );

  const handleDislikeComment = useCallback(
    async (commentId) => {
      try {
        const response = await fetch(`/api/comments/${commentId}/dislike`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const updatedComment = await response.json();
          setComments((prevComments) =>
            updateCommentTree(prevComments, updatedComment)
          );
          if (onCommentUpdate) onCommentUpdate();
        }
      } catch (error) {
        console.error("Error disliking comment:", error);
      }
    },
    [token, setComments, onCommentUpdate]
  );

  const handleReply = useCallback((commentId) => {
    setReplyingTo(commentId);
  }, []);

  const handleReplyCancel = useCallback(() => {
    setReplyingTo(null);
    setReplyContent("");
  }, []);

  const handleReplyContentChange = useCallback((value) => {
    setReplyContent(value);
  }, []);

  return (
    <div className="mt-4">
      {token && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Comment
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLikeComment}
            onDislike={handleDislikeComment}
            onReply={handleReply}
            replyingTo={replyingTo}
            replyContent={replyContent}
            onReplySubmit={handleSubmitReply}
            onReplyCancel={handleReplyCancel}
            onReplyContentChange={handleReplyContentChange}
          />
        ))}
      </div>
    </div>
  );
}
