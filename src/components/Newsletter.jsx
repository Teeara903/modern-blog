import { useState } from "react";
function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
const handleSubmit = (e) => {
  e.preventDefault();

  if (!email) return;

  setSubscribed(true);
  setEmail("");
};
  return (
    <section className="bg-[#171717] text-white">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-5">
          Stay in the loop
        </p>

        <h2 className="text-4xl md:text-6xl font-serif">
          Stories delivered to your inbox.
        </h2>

        <p className="mt-6 text-white/60">
          Join the newsletter for thoughtful stories and fresh perspectives.
        </p>
        {subscribed ? (
          <p className="mt-8 text-lg text-white">✓ Thanks for subscribing!</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-4 bg-white text-black outline-none"
            />

            <button
              type="submit"
              className="px-7 py-4 bg-white text-black font-medium hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
