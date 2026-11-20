
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function WriteArticlePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    image: "",
    content: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Your image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));

    setFormData((previous) => ({
      ...previous,
      image: "",
    }));
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      throw new Error("Please select a cover image.");
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary settings are missing. Check your frontend .env file."
      );
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", selectedImage);
      uploadData.append("upload_preset", UPLOAD_PRESET);
      uploadData.append("folder", "daily-edit/articles");

      console.log("Starting Cloudinary image upload...");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.secure_url) {
        throw new Error(
          data.error?.message || "Image upload failed. Please try again."
        );
      }

      console.log("Image upload successful.");

      return data.secure_url;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    console.log("PUBLISH BUTTON CLICKED");
    console.log("Token exists:", Boolean(localStorage.getItem("token")));
    console.log("API URL:", API_URL);
    console.log("Selected image:", selectedImage?.name || "No image selected");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before publishing your article.");
      navigate("/login");
      return;
    }

    if (!API_URL) {
      setError("Backend URL is missing. Check your frontend .env file.");
      return;
    }

    if (!selectedImage) {
      setError("Please choose a cover image before publishing.");
      return;
    }

    try {
      setLoading(true);

      console.log("Passed initial checks.");
      console.log("Starting image upload...");

      const imageUrl = await uploadImage();

      console.log("Image uploaded:", Boolean(imageUrl));
      console.log("Sending article to backend...");

      const response = await fetch(`${API_URL}/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      console.log("Article response status:", response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to publish your article."
        );
      }

      console.log("Article saved successfully.");

      setSuccess("Your article has been published successfully!");

      setFormData({
        title: "",
        category: "",
        excerpt: "",
        image: "",
        content: "",
      });

      setSelectedImage(null);
      setImagePreview("");

      event.target.reset();

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("PUBLISH ARTICLE ERROR:", err);
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-12 text-[#242424] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
          THE DAILY EDIT · COMMUNITY
        </p>

        <h1 className="font-serif text-4xl font-medium sm:text-5xl">
          Write an Article
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-gray-600">
          Have a story, idea, or perspective to share? Put your thoughts
          into words and contribute to our community.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-100 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="mt-6 rounded-lg bg-green-100 p-4 text-green-800"
          >
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block font-medium">
              Article title
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your story a meaningful title"
              required
              maxLength={150}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-700"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block font-medium">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-700"
            >
              <option value="">Choose a category</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Culture">Culture</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Creativity">Creativity</option>
            </select>
          </div>

          <div>
            <label htmlFor="excerpt" className="mb-2 block font-medium">
              Short summary
            </label>

            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Give readers a preview of your article"
              rows={3}
              required
              maxLength={300}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-700"
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="mb-2 block font-medium">
              Cover image
            </label>

            <input
              id="coverImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              required={!selectedImage}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              Select a JPG, PNG, or WebP image smaller than 5 MB.
            </p>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Selected article cover preview"
                  className="h-64 w-full rounded-xl object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (imagePreview.startsWith("blob:")) {
                      URL.revokeObjectURL(imagePreview);
                    }

                    setSelectedImage(null);
                    setImagePreview("");
                    setFormData((previous) => ({
                      ...previous,
                      image: "",
                    }));

                    const input = document.getElementById("coverImage");
                    if (input) input.value = "";
                  }}
                  className="mt-3 text-sm text-red-600 underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="content" className="mb-2 block font-medium">
              Your article
            </label>

            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Start writing your story here..."
              rows={12}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 leading-7 outline-none focus:border-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="rounded-full bg-[#242424] px-8 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingImage
              ? "Uploading image..."
              : loading
                ? "Publishing..."
                : "Publish Article"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default WriteArticlePage;
