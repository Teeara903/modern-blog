import { motion } from "framer-motion";
import { Link } from "react-router-dom";
function ArticleCard({ article }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      <div className="overflow-hidden mb-6">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-[280px] object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-black/50">
        {article.category}
      </p>

      <h3 className="mt-3 text-2xl font-serif leading-tight">
        {article.title}
      </h3>

      <p className="mt-4 text-black/60 leading-relaxed">{article.excerpt}</p>

      <Link
       to={`/articles/${article._id}`}
        className="mt-5 inline-block text-sm font-medium border-b border-black pb-1"
      >
        Read Article →
      </Link>
    </motion.article>
  );
}

export default ArticleCard;
