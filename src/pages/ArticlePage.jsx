import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ArticlePage() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [notice, setNotice] = useState("");

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkNotice, setBookmarkNotice] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // GET ARTICLE
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/articles/${id}`);

        if (!response.ok) {
          throw new Error("Article not found.");
        }

        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err.message || "Unable to load this article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, API_URL]);

  // GET CURRENT USER
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setCurrentUser(null);
        setIsBookmarked(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setCurrentUser(null);
          setIsBookmarked(false);
          return;
        }

        const data = await response.json();
        setCurrentUser(data.user);
      } catch (error) {
        console.error("Unable to retrieve user:", error);
        setCurrentUser(null);
        setIsBookmarked(false);
      }
    };

    fetchCurrentUser();
  }, [token, API_URL]);

  // CHECK WHETHER ARTICLE IS ALREADY SAVED
  useEffect(() => {
    const checkBookmark = async () => {
      if (!token || !currentUser) {
        setIsBookmarked(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to check saved articles.");
        }

        const data = await response.json();

        const alreadySaved = (data.bookmarks || []).some(
          (bookmark) => bookmark.article?._id === id,
        );

        setIsBookmarked(alreadySaved);
      } catch (error) {
        console.error("Bookmark check failed:", error);
      }
    };

    checkBookmark();
  }, [id, token, currentUser, API_URL]);

  // SAVE OR REMOVE BOOKMARK
  const handleBookmark = async () => {
    if (!token || !currentUser) {
      setBookmarkNotice("Please log in to save articles.");
      return;
    }

    try {
      setBookmarkLoading(true);
      setBookmarkNotice("");

      const response = await fetch(`${API_URL}/api/bookmarks/${id}`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update saved articles.");
      }

      setIsBookmarked(!isBookmarked);

      setBookmarkNotice(
        isBookmarked
          ? "Article removed from your saved articles."
          : "Article saved successfully!",
      );
    } catch (error) {
      setBookmarkNotice(error.message);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // GET COMMENTS
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);

      const response = await fetch(`${API_URL}/api/comments/${id}`);

      if (!response.ok) {
        throw new Error("Unable to load comments.");
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // POST COMMENT
  const handlePostComment = async (e) => {
    e.preventDefault();

    if (!token || !currentUser) {
      setNotice("Please log in to leave a comment.");
      return;
    }

    if (!commentText.trim()) {
      setNotice("Please write a comment first.");
      return;
    }

    try {
      setSubmitting(true);
      setNotice("");

      const response = await fetch(`${API_URL}/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: commentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to post comment.");
      }

      setComments((previous) => [data.comment, ...previous]);
      setCommentText("");
      setNotice("Comment posted successfully.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // EDIT COMMENT
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      setNotice("Comment cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to edit comment.");
      }

      setComments((previous) =>
        previous.map((comment) =>
          comment._id === commentId ? data.comment : comment,
        ),
      );

      setEditingId(null);
      setEditText("");
      setNotice("Comment updated successfully.");
    } catch (error) {
      setNotice(error.message);
    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete comment.");
      }

      setComments((previous) =>
        previous.filter((comment) => comment._id !== commentId),
      );

      setNotice("Comment deleted successfully.");
    } catch (error) {
      setNotice(error.message);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center">
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl font-serif">{error || "Article not found."}</h1>
        <Link to="/#articles" className="underline">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">
      <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link
          to="/#articles"
          className="inline-block mb-10 text-sm border-b border-black pb-1 hover:text-black/50 transition"
        >
          ← Back to Articles
        </Link>

        <p className="text-xs uppercase tracking-[0.3em] text-black/50 mb-5">
          {article.category}
        </p>

        <h1 className="text-5xl md:text-7xl font-serif leading-tight">
          {article.title}
        </h1>

        <p className="mt-6 text-xl text-black/60 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="mt-7">
          <button
            type="button"
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            aria-pressed={isBookmarked}
            className="border border-[#171717] px-6 py-3 text-sm hover:bg-[#171717] hover:text-white transition disabled:opacity-50"
          >
            {bookmarkLoading
              ? "Please wait..."
              : isBookmarked
                ? "♥ Saved — Remove from Saved"
                : "♡ Save Article"}
          </button>

          {bookmarkNotice && (
            <p className="text-sm text-[#66513d] mt-3" role="status">
              {bookmarkNotice}
              {!token && (
                <>
                  {" "}
                  <Link to="/login" className="underline">
                    Log in
                  </Link>
                </>
              )}
            </p>
          )}

          {currentUser && (
            <p className="text-xs text-black/40 mt-2">
              Find your collection in Saved Articles.
            </p>
          )}
        </div>

        <img
          src={article.image}
          alt={article.title}
          className="w-full h-[400px] md:h-[600px] object-cover mt-12"
        />

        <div className="mt-12 max-w-3xl">
          <p className="text-lg leading-8 text-black/70 whitespace-pre-line">
            {article.content}
          </p>
        </div>
      </article>

      {/* COMMENTS SECTION */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="border-t border-black/10 pt-12">
          <h2 className="text-3xl md:text-4xl font-serif">
            Join the Conversation
          </h2>

          <p className="text-black/50 mt-3">
            Share your thoughts about this article.
          </p>

          {notice && (
            <p
              role="status"
              className="mt-5 text-sm text-[#66513d]"
              aria-live="polite"
            >
              {notice}
            </p>
          )}

          {currentUser ? (
            <form onSubmit={handlePostComment} className="mt-8">
              <p className="text-sm text-black/60 mb-3">
                Commenting as{" "}
                <span className="font-semibold text-black">
                  {currentUser.name}
                </span>
              </p>

              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your thoughts..."
                maxLength={1000}
                rows={5}
                className="w-full bg-white border border-black/10 p-4 outline-none focus:border-black/40 resize-y"
              />

              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-black/40">
                  {commentText.length}/1000
                </span>

                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="bg-[#171717] text-white px-7 py-3 text-sm hover:bg-black/70 disabled:opacity-50 transition"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 bg-white border border-black/10 p-6">
              <p className="text-black/60">
                You need an account to join the conversation.
              </p>

              <Link
                to="/login"
                className="inline-block mt-4 border-b border-black pb-1 text-sm"
              >
                Log in to comment →
              </Link>
            </div>
          )}

          {/* DISPLAY COMMENTS */}
          <div className="mt-14">
            <h3 className="text-xl font-serif mb-8">
              Comments ({comments.length})
            </h3>

            {commentsLoading ? (
              <p className="text-black/50">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-black/50">
                No comments yet. Be the first to share your thoughts.
              </p>
            ) : (
              <div className="space-y-8">
                {comments.map((comment) => {
                  const isCommentOwner =
                    currentUser && comment.author?._id === currentUser._id;

                  const isArticleOwner =
                    currentUser && article.author?._id === currentUser._id;

                  return (
                    <div
                      key={comment._id}
                      className="border-b border-black/10 pb-7"
                    >
                      <div className="flex flex-wrap justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {comment.author?.name || "Reader"}
                          </p>

                          <p className="text-xs text-black/40 mt-1">
                            {formatDate(comment.createdAt)}
                            {comment.updatedAt !== comment.createdAt &&
                              " · Edited"}
                          </p>
                        </div>

                        {(isCommentOwner || isArticleOwner) && (
                          <div className="flex gap-4 text-sm">
                            {isCommentOwner && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(comment._id);
                                  setEditText(comment.content);
                                }}
                                className="underline text-black/60"
                              >
                                Edit
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment._id)}
                              className="underline text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {editingId === comment._id ? (
                        <div className="mt-4">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            className="w-full bg-white border border-black/10 p-4 outline-none focus:border-black/40"
                          />

                          <div className="flex gap-4 mt-3">
                            <button
                              type="button"
                              onClick={() => handleEditComment(comment._id)}
                              className="bg-[#171717] text-white px-5 py-2 text-sm"
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditText("");
                              }}
                              className="text-sm underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-4 text-black/70 leading-7 whitespace-pre-line">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ArticlePage;
