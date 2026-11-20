import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function EditArticlePage() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.info("Please log in to edit your article.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/articles/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load article.");
        }

        const article = data.article || data;

        setFormData({
          title: article.title || "",
          category: article.category || "",
          excerpt: article.excerpt || "",
          image: article.image || "",
          content: article.content || "",
        });

        setImagePreview(article.image || "");
      } catch (error) {
        toast.error(error.message || "Could not load this article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
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

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Your image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary settings are missing.");
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", selectedImage);
      uploadData.append("upload_preset", UPLOAD_PRESET);
      uploadData.append("folder", "daily-edit/articles");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      const data = await response.json();

      if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Image upload failed.");
      }

      return data.secure_url;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in again.");
      navigate("/login");
      return;
    }

    if (!API_URL) {
      toast.error("Backend URL is missing.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = formData.image;

      // Upload a new image only if one was selected.
      if (selectedImage) {
        imageUrl = await uploadImage();
      }

      const response = await fetch(`${API_URL}/api/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update your article.");
      }

      toast.success("Your article has been updated successfully!");

      navigate("/my-articles");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-5 py-20 text-center">
        <p className="text-gray-600">Loading your article...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-12 text-[#242424] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
          THE DAILY EDIT · COMMUNITY
        </p>

        <h1 className="font-serif text-4xl font-medium sm:text-5xl">
          Edit Your Article
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-gray-600">
          Make changes to your story and keep sharing your perspective with the
          community.
        </p>

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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              Leave this empty to keep your current image. Choose a new JPG,
              PNG, or WebP image under 5 MB to replace it.
            </p>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Article cover preview"
                  className="h-64 w-full rounded-xl object-cover"
                />
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
              rows={12}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 leading-7 outline-none focus:border-gray-700"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="rounded-full bg-[#242424] px-8 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingImage
                ? "Uploading image..."
                : saving
                  ? "Saving changes..."
                  : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/my-articles")}
              className="rounded-full border border-gray-400 px-8 py-3 font-medium transition hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditArticlePage;
