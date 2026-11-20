import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticleCard from "./components/ArticleCard";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedArticle from "./components/FeaturedArticle";
import Categories from "./components/Categories";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import ArticlePage from "./pages/ArticlePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import WriteArticlePage from "./pages/WriteArticlePage";
import MyArticlesPage from "./pages/MyArticlesPage";
import EditArticlePage from "./pages/EditArticlePage";
import SavedArticlesPage from "./pages/SavedArticlesPage";
// const articles = [
//   {
//     id: 1,
//     category: "Lifestyle",
//     title: "Finding Beauty in the Ordinary",
//     excerpt:
//       "Sometimes the most meaningful stories are hidden inside the simplest moments of everyday life.",
//     image:
//       "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
//     content:
//       "Sometimes we spend so much time searching for extraordinary moments that we forget to appreciate the beauty already surrounding us. The quiet mornings, simple conversations, familiar places and little moments of joy can often become the memories we treasure most.",
//   },
//   {
//     id: 2,
//     category: "Travel",
//     title: "Places That Change the Way You See the World",
//     excerpt:
//       "A journey is more than a destination. It is the people, experiences and memories along the way.",
//     image:
//       "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
//     content:
//       "Travel gives us the opportunity to step outside what is familiar and experience the world from a different perspective. Every journey introduces new places, people and experiences that can change how we understand ourselves and the world around us.",
//   },
//   {
//     id: 3,
//     category: "Culture",
//     title: "The Stories Behind What We Create",
//     excerpt:
//       "Exploring creativity, identity and the ideas that shape the things we make.",
//     image:
//       "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
//     content:
//       "Everything we create carries a story. From art and design to music and writing, creativity allows us to express ideas, experiences and parts of our identity. Understanding those stories can help us appreciate creative work in a deeper way.",
//   },
//   {
//     id: 4,
//     category: "Technology",
//     title: "How Technology Is Changing the Way We Work",
//     excerpt:
//       "From artificial intelligence to remote collaboration, technology continues to reshape how we work and communicate.",
//     image:
//       "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
//     content:
//       "Technology has changed the way people work, communicate and solve problems. From artificial intelligence to digital collaboration tools, new technologies are creating opportunities for individuals and businesses to work more efficiently and connect with people around the world.",
//   },
//   {
//     id: 5,
//     category: "Business",
//     title: "Building Ideas That Create Real Value",
//     excerpt:
//       "A successful business starts with understanding a problem and creating something people genuinely need.",
//     image:
//       "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
//     content:
//       "Great businesses are often built around simple ideas that solve real problems. Understanding customers, building strong relationships and continuously improving an idea can turn a small concept into something valuable and sustainable.",
//   },
//   {
//     id: 6,
//     category: "Creativity",
//     title: "Why Creativity Matters More Than Ever",
//     excerpt:
//       "Creativity is not only about art. It is the ability to see possibilities where others see limitations.",
//     image:
//       "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
//     content:
//       "Creativity allows us to approach problems from different perspectives and develop new ideas. Whether through writing, design, photography, music or technology, creativity helps people communicate, innovate and make meaningful contributions.",
//   },
// ];


function Home() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/articles`
        );

        if (!response.ok) {
          throw new Error("Failed to load articles.");
        }

        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(
          "Unable to load articles. Please check that your server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || article.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">
      <Navbar />
      <Hero />

      {articles.length > 0 && (
        <FeaturedArticle article={articles[0]} />
      )}

      <section id="articles" className="bg-white border-y border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/50 mb-3">
                Discover
              </p>

              <h2 className="text-4xl md:text-5xl font-serif">
                Latest Articles
              </h2>

              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-6 w-full md:w-80 border border-black/20 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <a
              href="#articles"
              className="hidden md:block text-sm border-b border-black pb-1"
            >
              View All →
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p>Loading articles...</p>
            ) : error ? (
              <p>{error}</p>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))
            ) : (
              <p>No articles found.</p>
            )}
          </div>
        </div>
      </section>

      <Categories
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      <Newsletter />
      <Footer />
    </main>
  );
}

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/write-article" element={<WriteArticlePage />} />
        <Route path="/my-articles" element={<MyArticlesPage />} />
        <Route path="/edit-article/:id" element={<EditArticlePage />} />
        <Route path="/saved-articles" element={<SavedArticlesPage />} />
      </Routes>
    </>
  );
}
export default App;
