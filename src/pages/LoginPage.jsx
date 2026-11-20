
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to log in.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="text-3xl font-serif tracking-tight">
          THE DAILY EDIT<span className="text-black/40">.</span>
        </Link>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Welcome back
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-serif">
            Log in
          </h1>

          <p className="mt-4 text-black/60 leading-relaxed">
            Sign in to continue your journey with THE DAILY EDIT.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#171717] text-white py-4 text-sm hover:bg-black/80 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-black/60">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-black border-b border-black pb-1"
          >
            Sign up
          </Link>
        </p>

        <Link
          to="/"
          className="inline-block mt-8 text-sm text-black/50 hover:text-black"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

export default LoginPage;
