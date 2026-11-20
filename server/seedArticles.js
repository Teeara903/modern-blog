
require("dotenv").config();
const mongoose = require("mongoose");
const Article = require("./models/Article");

const articles = [
  {
    id: 1,
    category: "Lifestyle",
    title: "Finding Beauty in the Ordinary",
    excerpt:
      "Sometimes the most meaningful stories are hidden inside the simplest moments of everyday life.",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
    content:
      "Sometimes we spend so much time searching for extraordinary moments that we forget to appreciate the beauty already surrounding us. The quiet mornings, simple conversations, familiar places and little moments of joy can often become the memories we treasure most.",
  },
  {
    id: 2,
    category: "Travel",
    title: "Places That Change the Way You See the World",
    excerpt:
      "A journey is more than a destination. It is the people, experiences and memories along the way.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    content:
      "Travel gives us the opportunity to step outside what is familiar and experience the world from a different perspective. Every journey introduces new places, people and experiences that can change how we understand ourselves and the world around us.",
  },
  {
    id: 3,
    category: "Culture",
    title: "The Stories Behind What We Create",
    excerpt:
      "Exploring creativity, identity and the ideas that shape the things we make.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    content:
      "Everything we create carries a story. From art and design to music and writing, creativity allows us to express ideas, experiences and parts of our identity. Understanding those stories can help us appreciate creative work in a deeper way.",
  },
  {
    id: 4,
    category: "Technology",
    title: "How Technology Is Changing the Way We Work",
    excerpt:
      "From artificial intelligence to remote collaboration, technology continues to reshape how we work and communicate.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    content:
      "Technology has changed the way people work, communicate and solve problems. From artificial intelligence to digital collaboration tools, new technologies are creating opportunities for individuals and businesses to work more efficiently and connect with people around the world.",
  },
  {
    id: 5,
    category: "Business",
    title: "Building Ideas That Create Real Value",
    excerpt:
      "A successful business starts with understanding a problem and creating something people genuinely need.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    content:
      "Great businesses are often built around simple ideas that solve real problems. Understanding customers, building strong relationships and continuously improving an idea can turn a small concept into something valuable and sustainable.",
  },
  {
    id: 6,
    category: "Creativity",
    title: "Why Creativity Matters More Than Ever",
    excerpt:
      "Creativity is not only about art. It is the ability to see possibilities where others see limitations.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
    content:
      "Creativity allows us to approach problems from different perspectives and develop new ideas. Whether through writing, design, photography, music or technology, creativity helps people communicate, innovate and make meaningful contributions.",
  },
];

async function seedArticles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existingArticles = await Article.countDocuments();

    if (existingArticles > 0) {
      console.log(
        "Articles already exist. Nothing was added."
      );
      return;
    }

    const articlesToSave = articles.map(
      ({ id, ...article }) => article
    );

    const savedArticles = await Article.insertMany(
      articlesToSave
    );

    console.log(
      `${savedArticles.length} articles added successfully!`
    );
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedArticles();
