import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { myProjectWorksAPI } from "../../../services/apiService";
import TinyMCEEditor from "../../ui/TinyMCEEditor";
import MarkdownEditor from "../../ui/MarkdownEditor";
import { motion } from "framer-motion";

// Validation schema based on mongoose model
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Project name is required")
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be less than 100 characters"),
  category: yup
    .string()
    .required("Category is required")
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category must be less than 50 characters"),
  overview: yup
    .string()
    .required("Overview is required")
    .trim()
    .min(10, "Overview must be at least 10 characters")
    .max(1000, "Overview must be less than 1000 characters"),
  documentation: yup.string().trim(),
  technology: yup
    .string()
    .required("Technologies are required")
    .test("at-least-one-tech", "At least one technology is required", function (value) {
      if (!value) return false;
      const techs = value
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);
      return techs.length > 0;
    }),
  liveWebsite: yup.string().trim().url("Must be a valid URL").nullable(),
  liveWebsiteRepo: yup.string().trim().url("Must be a valid URL").nullable(),
  liveServersite: yup.string().trim().url("Must be a valid URL").nullable(),
  liveServersiteRepo: yup.string().trim().url("Must be a valid URL").nullable(),
  mdDocumentation: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Documentation title is required").trim(),
      content: yup.string().required("Documentation content is required").trim(),
      slug: yup.string().trim(),
    })
  ),
});

const initialForm = {
  name: "",
  category: "",
  overview: "",
  documentation: "",
  technology: "",
  liveWebsite: "",
  liveWebsiteRepo: "",
  liveServersite: "",
  liveServersiteRepo: "",
  screenshots: [], // new images
  mdDocumentation: [], // { title, content, slug }
};

const MyProjectWorksForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [existingImages, setExistingImages] = useState([]); // { _id, url }
  const [existingDocs, setExistingDocs] = useState([]); // { _id, title, content, slug }
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const [isDragActive, setIsDragActive] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: initialForm,
  });

  const formValues = watch();

  // Fetch project data if editing
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      myProjectWorksAPI
        .getProjectWork(id)
        .then(data => {
          const formData = {
            name: data.name || "",
            category: data.category || "",
            overview: data.overview || "",
            documentation: data.documentation || "",
            technology: Array.isArray(data.technology)
              ? data.technology.join(", ")
              : data.technology || "",
            liveWebsite: data.liveWebsite || "",
            liveWebsiteRepo: data.liveWebsiteRepo || "",
            liveServersite: data.liveServersite || "",
            liveServersiteRepo: data.liveServersiteRepo || "",
            screenshots: [], // new images only
            mdDocumentation: [], // new docs only
          };

          // Reset form with fetched data
          reset(formData);
          setExistingImages(data.screenshots || []);
          setExistingDocs(data.mdDocumentation || []);
        })
        .catch(err => {
          setError("Failed to load project");
          toast.error("Failed to load project");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  // Handle input changes with validation
  const handleChange = e => {
    const { name, value } = e.target;
    setValue(name, value, { shouldValidate: true });
  };

  // Handle TinyMCE change
  const handleDocChange = value => {
    setValue("documentation", value, { shouldValidate: true });
  };

  // Handle technology as comma-separated
  const handleTechChange = e => {
    setValue("technology", e.target.value, { shouldValidate: true });
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (formValues.screenshots.length + files.length + existingImages.length > 20) {
      toast.error("Max 20 images allowed");
      return;
    }
    setValue("screenshots", [...formValues.screenshots, ...files], { shouldValidate: true });
  };
  const handleDragOver = e => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragActive(false);
  };
  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image file input
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (formValues.screenshots.length + files.length + existingImages.length > 20) {
      toast.error("Max 20 images allowed");
      return;
    }
    setValue("screenshots", [...formValues.screenshots, ...files], { shouldValidate: true });
  };

  // Remove new image before upload
  const removeNewImage = idx => {
    const newScreenshots = formValues.screenshots.filter((_, i) => i !== idx);
    setValue("screenshots", newScreenshots, { shouldValidate: true });
  };

  // Remove existing image (API call)
  const removeExistingImage = async imageId => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await myProjectWorksAPI.deleteProjectWorkImage(id, imageId);
      setExistingImages(prev => prev.filter(img => img._id !== imageId));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // Markdown docs handlers
  const addMdDoc = () => {
    const newDocs = [...formValues.mdDocumentation, { title: "", content: "", slug: "" }];
    setValue("mdDocumentation", newDocs, { shouldValidate: true });
  };
  const removeMdDoc = idx => {
    const newDocs = formValues.mdDocumentation.filter((_, i) => i !== idx);
    setValue("mdDocumentation", newDocs, { shouldValidate: true });
  };
  const handleMdDocChange = (idx, field, value) => {
    const newDocs = formValues.mdDocumentation.map((doc, i) =>
      i === idx ? { ...doc, [field]: value } : doc
    );
    setValue("mdDocumentation", newDocs, { shouldValidate: true });
  };
  // Remove existing doc (API call)
  const removeExistingDoc = async docId => {
    if (!window.confirm("Delete this documentation entry?")) return;
    try {
      await myProjectWorksAPI.deleteProjectWorkDoc(id, docId);
      setExistingDocs(prev => prev.filter(doc => doc._id !== docId));
      toast.success("Documentation deleted");
    } catch {
      toast.error("Failed to delete documentation");
    }
  };

  // Handle form submit with validation
  const onSubmit = async data => {
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("overview", data.overview);
      formData.append("documentation", data.documentation);
      formData.append(
        "technology",
        data.technology
          .split(",")
          .map(t => t.trim())
          .filter(Boolean)
          .join(",")
      );
      formData.append("liveWebsite", data.liveWebsite);
      formData.append("liveWebsiteRepo", data.liveWebsiteRepo);
      formData.append("liveServersite", data.liveServersite);
      formData.append("liveServersiteRepo", data.liveServersiteRepo);
      // Images
      data.screenshots.forEach(file => {
        formData.append("screenshots", file);
      });
      // Markdown docs
      formData.append("mdDocumentation", JSON.stringify(data.mdDocumentation));

      let res;
      if (isEdit) {
        res = await myProjectWorksAPI.updateProjectWork(id, formData);
        toast.success("Project updated");
      } else {
        res = await myProjectWorksAPI.createProjectWork(formData);
        toast.success("Project created");
      }
      navigate("../");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit");
      toast.error(err?.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="max-w-3xl mx-auto bg-[var(--background-paper)] p-6 rounded-lg border border-[var(--border-main)] space-y-6 shadow-lg"
    >
      <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
        {isEdit ? "Edit" : "Create"} Project Work
      </h2>
      {error && (
        <div className="text-red-600 mb-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      {/* Name */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">Project Name</label>
        <input
          type="text"
          {...register("name")}
          placeholder="Project Name"
          className={`w-full border rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
          }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      {/* Category */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">Category</label>
        <input
          type="text"
          {...register("category")}
          placeholder="Category"
          className={`w-full border rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.category
              ? "border-red-500 focus:ring-red-500"
              : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
          }`}
        />
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>
      {/* Overview */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">Overview</label>
        <textarea
          {...register("overview")}
          placeholder="Project Overview"
          className={`w-full border rounded-lg px-3 py-2 min-h-[80px] bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 transition-colors duration-200 resize-vertical ${
            errors.overview
              ? "border-red-500 focus:ring-red-500"
              : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
          }`}
        />
        {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview.message}</p>}
      </div>
      {/* Documentation (TinyMCE) */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">
          Documentation (Rich Text)
        </label>
        <div className="border border-[var(--border-main)] rounded-lg overflow-hidden">
          <TinyMCEEditor value={formValues.documentation} onChange={handleDocChange} />
        </div>
      </div>
      {/* Technology */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">
          Technologies (comma separated)
        </label>
        <input
          type="text"
          {...register("technology")}
          placeholder="React, Node.js, MongoDB"
          className={`w-full border rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.technology
              ? "border-red-500 focus:ring-red-500"
              : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
          }`}
        />
        {errors.technology && (
          <p className="text-red-500 text-sm mt-1">{errors.technology.message}</p>
        )}
      </div>
      {/* Live Website */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">
          Live Website URL
        </label>
        <input
          type="url"
          {...register("liveWebsite")}
          placeholder="https://example.com"
          className={`w-full border rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.liveWebsite
              ? "border-red-500 focus:ring-red-500"
              : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
          }`}
        />
        {errors.liveWebsite && (
          <p className="text-red-500 text-sm mt-1">{errors.liveWebsite.message}</p>
        )}
      </div>
      {/* Live Website Repo */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">
          Frontend Repo URL
        </label>
        <input
          type="url"
          {...register("liveWebsiteRepo")}
          placeholder="https://github.com/username/frontend"
          className={`w-full border rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.liveWebsiteRepo
              ? "border-red-500 focus:ring-red-500"
              : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
          }`}
        />
        {errors.liveWebsiteRepo && (
          <p className="text-red-500 text-sm mt-1">{errors.liveWebsiteRepo.message}</p>
        )}
      </div>
      {/* Live Serversite */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">
          Backend Live URL
        </label>
        <input
          type="url"
          {...register("liveServersite")}
          placeholder="https://api.example.com"
          className={`w-full border rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.liveServersite
              ? "border-red-500 focus:ring-red-500"
              : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
          }`}
        />
        {errors.liveServersite && (
          <p className="text-red-500 text-sm mt-1">{errors.liveServersite.message}</p>
        )}
      </div>
      {/* Live Serversite Repo */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">
          Backend Repo URL
        </label>
        <input
          type="url"
          {...register("liveServersiteRepo")}
          placeholder="https://github.com/username/backend"
          className={`w-full border rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.liveServersiteRepo
              ? "border-red-500 focus:ring-red-500"
              : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
          }`}
        />
        {errors.liveServersiteRepo && (
          <p className="text-red-500 text-sm mt-1">{errors.liveServersiteRepo.message}</p>
        )}
      </div>
      {/* Images (multiple upload, max 20) */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">
          Screenshots (max 20)
        </label>
        <div
          className={`mb-2 w-full p-6 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 bg-[var(--background-default)] text-[var(--text-secondary)] border-dashed ${
            isDragActive
              ? "border-[var(--primary-main)] bg-[var(--background-elevated)]"
              : "border-[var(--border-main)]"
          }`}
          onClick={handleDropzoneClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          aria-label="Upload screenshots by clicking or dragging"
        >
          <input
            type="file"
            name="screenshots"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
            tabIndex={-1}
          />
          <span className="text-lg font-medium mb-1 select-none">
            {isDragActive ? "Drop images here..." : "Click or drag images to upload"}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {formValues.screenshots.length + existingImages.length} / 20 images selected
          </span>
        </div>
        {/* Previews for new images */}
        <div className="flex flex-wrap gap-2 mb-2">
          {formValues.screenshots.map((file, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 border border-[var(--border-main)] rounded-lg overflow-hidden bg-[var(--background-default)]"
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg px-1 text-xs hover:bg-red-700 transition-colors duration-200"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {/* Existing images (edit mode) */}
        {isEdit && existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {existingImages.map(img => (
              <div
                key={img._id}
                className="relative w-20 h-20 border border-[var(--border-main)] rounded-lg overflow-hidden bg-[var(--background-default)]"
              >
                <img src={img.url} alt="existing" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img._id)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg px-1 text-xs hover:bg-red-700 transition-colors duration-200"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Markdown Documentation (multiple, dynamic) */}
      <div>
        <label className="block font-medium mb-1 text-[var(--text-primary)]">
          Markdown Documentation
        </label>
        {isEdit && existingDocs.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-sm mb-1 text-[var(--text-primary)]">
              Existing Docs
            </div>
            {existingDocs.map(doc => (
              <div
                key={doc._id}
                className="border border-[var(--border-main)] rounded-lg p-3 mb-3 bg-[var(--background-elevated)] relative"
              >
                <div className="font-bold text-[var(--text-primary)]">{doc.title}</div>
                <div className="text-xs text-[var(--text-secondary)] mb-2">Slug: {doc.slug}</div>
                <div className="border border-[var(--border-main)] rounded-lg overflow-hidden">
                  <MarkdownEditor value={doc.content} readOnly />
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingDoc(doc._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-lg px-3 py-1 text-xs hover:bg-red-700 transition-colors duration-200"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        {formValues.mdDocumentation.map((doc, idx) => (
          <div
            key={idx}
            className="border border-[var(--border-main)] rounded-lg p-3 mb-3 bg-[var(--background-elevated)] relative"
          >
            <input
              type="text"
              value={doc.title}
              onChange={e => handleMdDocChange(idx, "title", e.target.value)}
              placeholder="Doc Title"
              className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 mb-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
            />
            <input
              type="text"
              value={doc.slug}
              onChange={e => handleMdDocChange(idx, "slug", e.target.value)}
              placeholder="Slug (optional)"
              className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 mb-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
            />
            <div className="border border-[var(--border-main)] rounded-lg overflow-hidden">
              <MarkdownEditor
                value={doc.content}
                onChange={val => handleMdDocChange(idx, "content", val)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeMdDoc(idx)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-lg px-3 py-1 text-xs hover:bg-red-700 transition-colors duration-200"
              title="Remove"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addMdDoc}
          className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg mt-2 hover:bg-[var(--primary-dark)] transition-colors duration-200 font-medium"
        >
          Add Markdown Doc
        </button>
      </div>
      {/* Submit */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={submitting || !isValid}
          className="flex-1 py-3 bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] text-white rounded-lg font-bold text-lg shadow-lg hover:from-[var(--primary-dark)] hover:to-[var(--primary-main)] transition-all duration-300 disabled:opacity-50"
        >
          {submitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Project"
            : "Create Project"}
        </motion.button>
      </div>
    </form>
  );
};

export default MyProjectWorksForm;
