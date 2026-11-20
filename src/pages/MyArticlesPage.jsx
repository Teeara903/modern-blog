import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

function MyArticlesPage() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchMyArticles = async () => {
      const token = getToken();

      if (!token) {
        toast.info("Please log in to view your articles.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load articles. Please try again.");
        }

        const data = await response.json();

        const userResponse = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error(
            "We couldn't verify your account. Please log in again.",
          );
        }

        const userData = await userResponse.json();
        const userId = userData.user?._id || userData._id;

        if (!userId) {
          throw new Error("Your account details could not be identified.");
        }

        const ownArticles = data.filter((article) => {
          const authorId =
            typeof article.author === "object"
              ? article.author?._id
              : article.author;

          return authorId && String(authorId) === String(userId);
        });

        setArticles(ownArticles);
      } catch (err) {
        toast.error(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyArticles();
  }, [navigate]);

  const handleDelete = async () => {
    if (!articleToDelete) return;

    const articleId = articleToDelete._id;

    setDeletingId(articleId);

    try {
      const response = await fetch(`${API_URL}/api/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete this article.");
      }

      setArticles((current) =>
        current.filter((article) => article._id !== articleId),
      );

      setArticleToDelete(null);
      toast.success("Article deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Unable to delete this article.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/50 mb-3">
              Your writing space
            </p>

            <h1 className="text-4xl md:text-6xl font-serif">My Articles</h1>

            <p className="mt-4 text-black/60">
              Manage the stories and ideas you've shared with the world.
            </p>
          </div>

          <Link
            to="/write-article"
            className="inline-flex items-center justify-center bg-[#171717] text-white px-6 py-3 hover:bg-black/80 transition"
          >
            + Write an Article
          </Link>
        </div>

        {loading ? (
          <p className="py-12 text-black/60">Loading your articles...</p>
        ) : articles.length === 0 ? (
          <div className="border border-black/10 bg-white p-10 md:p-16 text-center">
            <h2 className="text-2xl font-serif mb-3">
              Your story starts here.
            </h2>

            <p className="text-black/60 mb-6">
              You haven't published any articles yet.
            </p>

            <Link
              to="/write-article"
              className="inline-block border-b border-black pb-1"
            >
              Publish your first article →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-black/50 mb-6">
              {articles.length} {articles.length === 1 ? "article" : "articles"}{" "}
              published
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article
                  key={article._id}
                  className="bg-white border border-black/10 overflow-hidden"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-black/50 mb-3">
                      {article.category}
                    </p>

                    <h2 className="text-2xl font-serif mb-3">
                      {article.title}
                    </h2>

                    <p className="text-sm text-black/60 mb-6">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/articles/${article._id}`}
                        className="border border-black/20 px-4 py-2 text-sm hover:bg-black hover:text-white transition"
                      >
                        Read
                      </Link>

                      <Link
                        to={`/edit-article/${article._id}`}
                        className="border border-black/20 px-4 py-2 text-sm hover:bg-black hover:text-white transition"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => setArticleToDelete(article)}
                        disabled={deletingId === article._id}
                        className="border border-red-200 text-red-700 px-4 py-2 text-sm hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-md bg-[#f7f5f0] p-8 shadow-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50 mb-3">
              Confirm action
            </p>

            <h2 className="text-3xl font-serif mb-3">Delete this article?</h2>

            <p className="text-sm text-black/60 mb-8">
              Are you sure you want to delete "{articleToDelete.title}"? This
              action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                disabled={deletingId !== null}
                className="flex-1 border border-black/20 px-5 py-3 hover:bg-white transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="flex-1 bg-red-700 text-white px-5 py-3 hover:bg-red-800 transition disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyArticlesPage;
