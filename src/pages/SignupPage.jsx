
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
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
        throw new Error(data.message || "Unable to create your account.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Your account has been created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
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
        <Link
          to="/"
          className="text-3xl font-serif tracking-tight"
        >
          THE DAILY EDIT<span className="text-black/40">.</span>
        </Link>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Join our community
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-serif">
            Create an account
          </h1>

          <p className="mt-4 text-black/60 leading-relaxed">
            Join THE DAILY EDIT and get ready to share your stories and ideas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm mb-2">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-black"
            />
          </div>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
              className="w-full border border-black/20 bg-white px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="text-sm text-green-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#171717] text-white py-4 text-sm hover:bg-black/80 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-black/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-black border-b border-black pb-1"
          >
            Log in
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

export default SignupPage;
