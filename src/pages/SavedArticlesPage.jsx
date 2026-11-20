import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

function SavedArticlesPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load saved articles.");
      }

      setBookmarks(data.bookmarks || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const removeBookmark = async (articleId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/bookmarks/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove article.");
      }

      setBookmarks((previous) =>
        previous.filter((bookmark) => bookmark.article?._id !== articleId),
      );

      toast.success("Article removed from saved articles.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center">
        <p className="text-gray-600">Loading your saved articles...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-16 md:px-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm text-gray-600 hover:text-black">
          ← Back to Home
        </Link>

        <div className="mt-10 mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
            Your Reading Collection
          </p>

          <h1 className="font-serif text-4xl md:text-5xl text-gray-900">
            Saved Articles
          </h1>

          <p className="text-gray-600 mt-4">
            Keep the stories and ideas you love close.
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="py-20 text-center border-t border-gray-300">
            <h2 className="font-serif text-2xl text-gray-800">
              Your collection is empty.
            </h2>

            <p className="text-gray-600 mt-3">
              Save articles you enjoy and find them here later.
            </p>

            <Link
              to="/"
              className="inline-block mt-6 border border-gray-900 px-6 py-3 text-sm hover:bg-gray-900 hover:text-white transition"
            >
              Explore Articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarks.map((bookmark) => {
              const article = bookmark.article;

              if (!article) return null;

              return (
                <article
                  key={bookmark._id}
                  className="bg-white/60 border border-gray-200"
                >
                  <Link to={`/articles/${article._id}`}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-56 object-cover"
                    />
                  </Link>

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {article.category}
                    </p>

                    <Link to={`/articles/${article._id}`}>
                      <h2 className="font-serif text-2xl mt-3 text-gray-900 hover:text-gray-600">
                        {article.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      <Link
                        to={`/articles/${article._id}`}
                        className="text-sm underline underline-offset-4"
                      >
                        Read Article
                      </Link>

                      <button
                        onClick={() => removeBookmark(article._id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default SavedArticlesPage;
