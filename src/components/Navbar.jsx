import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <nav className="relative border-b border-black/10 bg-[#f7f5f0]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight md:text-2xl">
          THE DAILY EDIT
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm md:flex">
          <Link to="/" className="transition hover:text-gray-500">
            Home
          </Link>

          <Link to="/#articles" className="transition hover:text-gray-500">
            Articles
          </Link>

          <Link to="/#categories" className="transition hover:text-gray-500">
            Categories
          </Link>

          <Link to="/write-article" className="transition hover:text-gray-500">
            Write an Article
          </Link>

          {token && (
            <Link
              to="/saved-articles"
              className="transition hover:text-gray-500"
            >
              Saved Articles
            </Link>
          )}
        </div>

        {/* Account Links */}
        <div className="hidden items-center gap-4 text-sm md:flex">
          {token ? (
            <>
              <Link
                to="/my-articles"
                className="transition hover:text-gray-500"
              >
                My Articles
              </Link>

              <Link to="/login" className="transition hover:text-gray-500">
                Account
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="transition hover:text-gray-500">
                Login
              </Link>

              <Link
                to="/signup"
                className="border border-black px-5 py-2.5 transition hover:bg-black hover:text-white"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b border-black/10 bg-[#f7f5f0] px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5 text-sm">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link to="/#articles" onClick={() => setMenuOpen(false)}>
              Articles
            </Link>

            <Link to="/#categories" onClick={() => setMenuOpen(false)}>
              Categories
            </Link>

            <Link
              to="/write-article"
              onClick={() => setMenuOpen(false)}
              className="font-medium"
            >
              Write an Article
            </Link>

            {token && (
              <>
                <Link to="/saved-articles" onClick={() => setMenuOpen(false)}>
                  Saved Articles
                </Link>

                <Link to="/my-articles" onClick={() => setMenuOpen(false)}>
                  My Articles
                </Link>
              </>
            )}

            <hr className="border-black/10" />

            {token ? (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Account
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="border border-black px-5 py-3 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
