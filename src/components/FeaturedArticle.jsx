import { motion } from "framer-motion";
import { Link } from "react-router-dom";
function FeaturedArticle({ article }) {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[450px] md:h-[600px] object-cover hover:scale-105 transition duration-700"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-black/50 mb-5">
            Featured Story
          </p>

          <h2 className="text-4xl md:text-5xl font-serif leading-tight">
            {article.title}
          </h2>

          <p className="mt-6 text-black/60 text-lg leading-relaxed">
            {article.excerpt}
          </p>

          <Link
           to={`/articles/${article._id}`}
            className="mt-8 border-b border-black pb-2 text-sm font-medium hover:text-black/50 transition"
          >
            Read Full Story →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedArticle;
