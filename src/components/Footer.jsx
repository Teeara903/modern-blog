function Footer() {
  return (
    <footer className="bg-[#111] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4">
        <p className="text-sm text-white/50">
          © 2026 The Daily Edit. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm text-white/50">
          <a href="#" className="hover:text-white transition">
            Instagram
          </a>

          <a href="#" className="hover:text-white transition">
            X
          </a>

          <a href="#" className="hover:text-white transition">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
