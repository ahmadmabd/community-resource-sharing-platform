"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  MapPin,
  Tag,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Plus,
  X,
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

type Category = {
  id: string;
  name: string;
};

type ResourceFormProps = {
  categories: Category[];
};

const conditions = [
  { value: "LIKE_NEW", label: "Like New", desc: "Barely used, looks new" },
  { value: "GOOD", label: "Good", desc: "Works perfectly, minor wear" },
  { value: "FAIR", label: "Fair", desc: "Works well, visible wear" },
];

function ResourceForm({ categories: initialCategories }: ResourceFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState(initialCategories);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestName, setSuggestName] = useState("");
  const [suggesting, setSuggesting] = useState(false);

  async function handleSuggestCategory() {
    if (!suggestName.trim()) return;
    setSuggesting(true);
    try {
      const res = await fetch("/api/categories/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: suggestName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success("Category suggestion sent to admin!", successToastStyle);
      setShowSuggest(false);
      setSuggestName("");
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setSuggesting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!condition) {
      toast.error("Please select a condition", successToastStyle);
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category", successToastStyle);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, categoryId, condition, location, city, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create resource", successToastStyle);
        return;
      }
      toast.success("Resource listed successfully!", successToastStyle);
      setTimeout(() => router.push("/resources"), 1000);
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-4 h-4 text-[#0F4C35]" />
          <h2 className="text-sm font-semibold text-[#0A1A12]">Basic information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Power Drill, Camping Tent"
              required
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the resource, how it can be used, and any important details..."
              rows={4}
              required
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A] resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Tag className="w-4 h-4 text-[#0F4C35]" />
          <h2 className="text-sm font-semibold text-[#0A1A12]">Category & condition</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowSuggest(!showSuggest)}
              className="mt-2 text-xs text-[#5BB88A] hover:text-[#0F4C35] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Don't see your category? Suggest one
            </button>

            {showSuggest && (
              <div className="mt-2 flex gap-2">
                <input
                  value={suggestName}
                  onChange={(e) => setSuggestName(e.target.value)}
                  placeholder="Category name..."
                  className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
                />
                <button
                  type="button"
                  onClick={handleSuggestCategory}
                  disabled={suggesting || !suggestName.trim()}
                  className="px-3 py-2 bg-[#0F4C35] text-white text-xs font-medium rounded-lg hover:bg-[#0F4C35]/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {suggesting ? "Sending..." : "Send"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSuggest(false); setSuggestName(""); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Condition</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {conditions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCondition(c.value)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    condition === c.value
                      ? "border-[#0F4C35] bg-[#0F4C35]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className={`text-xs font-semibold ${condition === c.value ? "text-[#0F4C35]" : "text-gray-700"}`}>
                    {c.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-[#0F4C35]" />
          <h2 className="text-sm font-semibold text-[#0A1A12]">Location</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Street / Area</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hamra Street"
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Beirut"
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <ImageIcon className="w-4 h-4 text-[#0F4C35]" />
          <h2 className="text-sm font-semibold text-[#0A1A12]">Image</h2>
        </div>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
          {imageUrl ? (
            <div className="relative">
              <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-50 cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-4">Upload a photo of your resource (max 4MB)</p>
              <UploadButton
                endpoint="imageUploader"
                appearance={{
                  button: '!bg-[#0F4C35] text-white text-sm font-medium rounded-xl px-6 py-2.5 hover:!bg-[#0F4C35]/90 transition-colors cursor-pointer ut-uploading:!bg-[#0F4C35]/70 ut-uploading:cursor-not-allowed',
                  container: 'w-full flex justify-center',
                  allowedContent: 'hidden',
                }}
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.ufsUrl) setImageUrl(res[0].ufsUrl);
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Upload failed: ${error.message}`, successToastStyle);
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          type="button"
          onClick={() => router.push("/resources")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0F4C35] text-white text-sm font-medium rounded-xl hover:bg-[#0F4C35]/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Creating..." : "List resource"}
        </button>
      </div>
    </form>
  );
}

export default ResourceForm;