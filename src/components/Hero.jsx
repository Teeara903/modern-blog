import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <p className="uppercase tracking-[0.3em] text-xs text-black/50 mb-6">
          Stories • Ideas • Perspectives
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.95] tracking-tight">
          Stories worth
          <br />
          <span className="italic">remembering.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg md:text-xl text-black/60 leading-relaxed">
          A space for thoughtful stories, creative ideas, culture, lifestyle and
          perspectives that make us pause and think.
        </p>
      </motion.div>
    </section>
  );
}

export default Hero;
