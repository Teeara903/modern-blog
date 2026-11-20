function Categories({ selectedCategory, onCategoryChange }) {
  const categories = [
    "All",
    "Lifestyle",
    "Travel",
    "Culture",
    "Technology",
    "Business",
    "Creativity",
  ];

  return (
    <section id="categories" className="max-w-7xl mx-auto px-6 py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-black/50 mb-3">
        Explore
      </p>

      <h2 className="text-4xl md:text-5xl font-serif mb-10">
        Browse by Category
      </h2>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`border px-6 py-3 text-sm transition ${
              selectedCategory === category
                ? "bg-black text-white border-black"
                : "border-black/20 hover:bg-black hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;
