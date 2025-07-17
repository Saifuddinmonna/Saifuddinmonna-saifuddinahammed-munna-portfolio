import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { myProjectWorksAPI } from "../../../services/apiService";
import TinyMCEEditor from "../../ui/TinyMCEEditor";
import MarkdownEditor from "../../ui/MarkdownEditor";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaUpload,
  FaFileUpload,
  FaArrowLeft,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

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
    .max(50, "Category must be less than 50 characters")
    .test("category-validation", "Please select or enter a valid category", function (value) {
      const { categoryType } = this.parent;

      if (categoryType === "predefined") {
        // For predefined, value should be one of the predefined categories
        return value && PREDEFINED_CATEGORIES.includes(value);
      } else if (categoryType === "other") {
        // For custom, value should be a non-empty string
        return value && value.trim().length >= 2;
      }

      return false;
    }),
  categoryType: yup
    .string()
    .required("Please select a category type")
    .oneOf(["predefined", "other"], "Invalid category type"),
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
  mdDocumentation: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required("Documentation title is required").trim(),
        content: yup.string().required("Documentation content is required").trim(),
        slug: yup.string().trim(),
      })
    )
    .notRequired(), // <-- make optional
});

// Predefined categories
const PREDEFINED_CATEGORIES = [
  "E-commerce Websites",
  "Educational Websites",
  "Blog Websites",
  "News & Magazine Websites",
  "Corporate / Business Websites",
  "Portfolio Websites",
  "Social Media Websites",
  "Entertainment Websites",
  "Non-Profit & Charity Websites",
  "Forum & Community Websites",
  "Directory & Listing Websites",
  "Web Application / SaaS Websites",
  "Government Websites",
  "Personal Websites",
  "Booking & Reservation Websites",
  "Review Websites",
  "Job Board / Career Websites",
  "Streaming Websites (Video/Music)",
  "Wiki / Knowledge Base Websites",
  "Event Websites",
  "Landing Page / Single-Page Websites",
  "Affiliate Websites",
  "Gaming Websites",
  "Health & Fitness Websites",
  "Real Estate Websites",
];

const initialForm = {
  name: "",
  category: "",
  categoryType: "predefined", // "predefined" or "other"
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

  console.log("🔄 [Form] Component rendered");
  console.log("🔄 [Form] URL params:", { id });
  console.log("🔄 [Form] Is edit mode:", isEdit);

  const [existingImages, setExistingImages] = useState([]); // { _id, url }
  const [existingDocs, setExistingDocs] = useState([]); // { _id, title, content, slug }
  const [keptExistingDocs, setKeptExistingDocs] = useState([]); // Track which existing docs to keep
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const existingMdFileInputRef = useRef();
  const [isDragActive, setIsDragActive] = useState(false);
  const [showMdPreview, setShowMdPreview] = useState({}); // Track preview state for each doc
  const [activeButton, setActiveButton] = useState(null); // Track which button is active (show-all, hide-all)
  const formRef = useRef();
  const topRef = useRef();
  const bottomRef = useRef();
  // Add refs for each doc for scrolling
  const docRefs = useRef({});

  // Helper to scroll to a doc
  const scrollToDoc = key => {
    if (docRefs.current[key]) {
      docRefs.current[key].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      ...initialForm,
      categoryType: "predefined", // Ensure default is set
    },
  });

  const formValues = watch();

  // Ensure category type is set on initial render
  useEffect(() => {
    if (!formValues.categoryType) {
      console.log("🔄 [Form] Setting default category type");
      setValue("categoryType", "predefined", { shouldValidate: false });
    }
  }, [formValues.categoryType, setValue]);

  // Helper function to get input className with loading state
  const getInputClassName = hasError => {
    return `w-full border rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50 focus:outline-none focus:ring-2 transition-colors duration-200 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-[var(--border-main)] focus:ring-[var(--primary-main)]"
    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`;
  };

  // Fetch project data if editing
  useEffect(() => {
    console.log("🔄 [Form] useEffect triggered, isEdit:", isEdit, "id:", id);
    console.log("🔄 [Form] Current URL:", window.location.href);
    console.log("🔄 [Form] Current pathname:", window.location.pathname);

    if (isEdit && id) {
      setLoading(true);
      setError("");
      console.log("🔄 [Form] Loading project for edit, ID:", id);

      myProjectWorksAPI
        .getProjectWork(id)
        .then(response => {
          console.log("✅ [Form] Edit data received:", response);
          console.log("✅ [Form] Response type:", typeof response);
          console.log("✅ [Form] Response keys:", Object.keys(response));

          // Extract actual project data from nested response
          let projectData = response;
          if (response && response.data) {
            projectData = response.data;
            console.log("✅ [Form] Found nested data structure");
          } else if (response && response.success && response.data) {
            projectData = response.data;
            console.log("✅ [Form] Found success wrapper with data");
          }

          console.log("📋 [Form] Extracted project data:", projectData);
          console.log("📋 [Form] Project data keys:", Object.keys(projectData || {}));

          // Process technology array properly
          let technologyString = "";
          if (projectData?.technology) {
            if (Array.isArray(projectData.technology)) {
              technologyString = projectData.technology.join(", ");
            } else if (typeof projectData.technology === "string") {
              technologyString = projectData.technology;
            }
          }

          const formData = {
            name: projectData?.name || "",
            category: projectData?.category || "",
            categoryType:
              projectData?.categoryType ||
              (PREDEFINED_CATEGORIES.includes(projectData?.category) ? "predefined" : "other"),
            overview: projectData?.overview || "",
            documentation: projectData?.documentation || "",
            technology: technologyString,
            liveWebsite: projectData?.liveWebsite || "",
            liveWebsiteRepo: projectData?.liveWebsiteRepo || "",
            liveServersite: projectData?.liveServersite || "",
            liveServersiteRepo: projectData?.liveServersiteRepo || "",
            screenshots: [], // new images only
            mdDocumentation: [], // new docs only
          };

          console.log("📝 [Form] Processed form data:", formData);

          // Reset form with fetched data
          reset(formData);

          // Set existing data
          setExistingImages(projectData?.images || []);
          setExistingDocs(projectData?.mdDocumentation || []);
          // Initialize kept existing docs (all existing docs are kept initially)
          setKeptExistingDocs(projectData?.mdDocumentation || []);

          // Initialize preview states for existing docs
          const previewStates = {};
          (projectData?.mdDocumentation || []).forEach((doc, idx) => {
            previewStates[`existing-${idx}`] = false;
          });
          setShowMdPreview(previewStates);

          console.log("✅ [Form] Form reset completed with data");
        })
        .catch(err => {
          console.error("❌ [Form] Error loading project:", err);
          setError("Failed to load project");
          toast.error("Failed to load project");
        })
        .finally(() => setLoading(false));
    } else if (!isEdit) {
      // Reset form for create mode
      const createFormData = {
        ...initialForm,
        categoryType: "predefined", // Ensure default is set
      };
      console.log("🔄 [Form] Resetting form for create mode:", createFormData);
      reset(createFormData);
      setExistingImages([]);
      setExistingDocs([]);
      setKeptExistingDocs([]);
      setShowMdPreview({});
      setActiveButton(null);
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
    console.log("imageid id deleting ", imageId);
    if (!window.confirm("Delete this image?")) return;
    try {
      await myProjectWorksAPI.deleteProjectWorkImage(id, encodeURIComponent(imageId));
      setExistingImages(prev => {
        const updated = prev.filter(img => img.public_id !== imageId);
        console.log("Updated images after delete:", updated);
        return updated;
      });
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // Markdown docs handlers
  const addMdDoc = () => {
    const newDocs = [...formValues.mdDocumentation, { title: "", content: "", slug: "" }];
    setValue("mdDocumentation", newDocs, { shouldValidate: true });
    // Initialize preview state for new doc
    setShowMdPreview(prev => ({ ...prev, [`new-${newDocs.length - 1}`]: false }));
  };
  const removeMdDoc = idx => {
    const newDocs = formValues.mdDocumentation.filter((_, i) => i !== idx);
    setValue("mdDocumentation", newDocs, { shouldValidate: true });
    // Remove preview state
    setShowMdPreview(prev => {
      const newState = { ...prev };
      delete newState[`new-${idx}`];
      return newState;
    });
  };
  const handleMdDocChange = (idx, field, value) => {
    const newDocs = formValues.mdDocumentation.map((doc, i) =>
      i === idx ? { ...doc, [field]: value } : doc
    );
    setValue("mdDocumentation", newDocs, { shouldValidate: true });
  };

  // Toggle markdown preview
  const toggleMdPreview = (docType, idx) => {
    const key = `${docType}-${idx}`;
    console.log(`[DEBUG] Toggling preview for ${key}, current state:`, showMdPreview[key]);
    setShowMdPreview(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      console.log(`[DEBUG] New preview state for ${key}:`, newState[key]);
      return newState;
    });
  };

  // Updated handleMultipleMdFileUpload
  const handleMultipleMdFileUpload = (e, docType = "new") => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    // Filter only .md files
    const mdFiles = files.filter(file => file.name.endsWith(".md"));
    if (mdFiles.length === 0) {
      toast.error("Please select .md files only");
      return;
    }
    if (mdFiles.length !== files.length) {
      toast.warning(`${files.length - mdFiles.length} non-.md files were ignored`);
    }
    // Read all files and add to mdDocumentation at once
    const newDocs = [];
    let filesProcessed = 0;
    mdFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = event => {
        const content = event.target.result;
        const fileName = file.name.replace(".md", "");
        newDocs.push({ title: fileName, content: content, slug: "" });
        filesProcessed++;
        if (filesProcessed === mdFiles.length) {
          // Add all at once
          const updatedDocs = [...formValues.mdDocumentation, ...newDocs];
          setValue("mdDocumentation", updatedDocs, { shouldValidate: true });
          // Set preview state to hidden for all new docs (don't auto-show)
          const newPreviewState = { ...showMdPreview };
          for (let i = formValues.mdDocumentation.length; i < updatedDocs.length; i++) {
            newPreviewState[`new-${i}`] = false; // Start with hidden preview
          }
          setShowMdPreview(newPreviewState);
          toast.success(
            `${mdFiles.length} markdown files uploaded! Use Show/Hide buttons to manage previews.`
          );
        }
      };
      reader.readAsText(file);
    });
    e.target.value = "";
  };

  // Updated Show All / Hide All logic for both new and existing docs
  const toggleAllPreviews = () => {
    const allPreviews = { ...showMdPreview };
    formValues.mdDocumentation.forEach((_, idx) => {
      allPreviews[`new-${idx}`] = true;
    });
    keptExistingDocs.forEach((_, idx) => {
      allPreviews[`existing-${idx}`] = true;
    });
    setShowMdPreview(allPreviews);
    setActiveButton("show-all");
    setTimeout(() => {
      setActiveButton(null);
    }, 1000);
  };
  const hideAllPreviews = () => {
    const allPreviews = { ...showMdPreview };
    formValues.mdDocumentation.forEach((_, idx) => {
      allPreviews[`new-${idx}`] = false;
    });
    keptExistingDocs.forEach((_, idx) => {
      allPreviews[`existing-${idx}`] = false;
    });
    setShowMdPreview(allPreviews);
    setActiveButton("hide-all");
    setTimeout(() => {
      setActiveButton(null);
    }, 1000);
  };

  // Check if all previews are shown (both new and existing)
  const areAllPreviewsShown = () => {
    const newDocsShown = formValues.mdDocumentation.every((_, idx) => showMdPreview[`new-${idx}`]);
    const existingDocsShown = keptExistingDocs.every((_, idx) => showMdPreview[`existing-${idx}`]);
    return newDocsShown && existingDocsShown;
  };

  // Check if any previews are shown
  const areAnyPreviewsShown = () => {
    const newDocsShown = formValues.mdDocumentation.some((_, idx) => showMdPreview[`new-${idx}`]);
    const existingDocsShown = keptExistingDocs.some((_, idx) => showMdPreview[`existing-${idx}`]);
    return newDocsShown || existingDocsShown;
  };

  // Handle single markdown file upload (existing function - keep for backward compatibility)
  const handleMdFileUpload = (e, idx, docType = "new") => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".md")) {
      toast.error("Please select a .md file");
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target.result;
      const fileName = file.name.replace(".md", "");

      if (docType === "new") {
        // Auto-fill title and content for new docs
        handleMdDocChange(idx, "title", fileName);
        handleMdDocChange(idx, "content", content);
        // Auto-show preview for uploaded content
        setShowMdPreview(prev => ({ ...prev, [`new-${idx}`]: true }));

        toast.success("Markdown file uploaded successfully! Preview enabled.");
      } else if (docType === "existing") {
        // For existing docs, we can't modify them directly, so we'll create a new doc
        const newDoc = { title: fileName, content: content, slug: "" };
        const newDocs = [...formValues.mdDocumentation, newDoc];
        setValue("mdDocumentation", newDocs, { shouldValidate: true });

        // Initialize preview state for new doc
        const newIdx = newDocs.length - 1;
        setShowMdPreview(prev => ({ ...prev, [`new-${newIdx}`]: true }));
        toast.success("Markdown file uploaded as new documentation! Preview enabled.");
      }
    };
    reader.readAsText(file);
  };

  // Copy markdown content to clipboard
  const copyMdContent = content => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success("Content copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy content");
      });
  };

  // Remove existing doc (API call)
  const removeExistingDoc = async docId => {
    if (!window.confirm("Delete this documentation entry?")) return;
    try {
      await myProjectWorksAPI.deleteProjectWorkDoc(id, docId);
      setExistingDocs(prev => prev.filter(doc => doc._id !== docId));
      // Also remove from kept existing docs
      setKeptExistingDocs(prev => prev.filter(doc => doc._id !== docId));
      toast.success("Documentation deleted");
    } catch {
      toast.error("Failed to delete documentation");
    }
  };

  // Remove markdown doc (handles both backend and unsaved docs)
  const removeMdDocument = async docId => {
    // If docId is falsy, it's a new/unsaved doc, just remove from state
    if (!docId) {
      toast.info("Removed unsaved markdown doc from form");
      console.log("[DEBUG] Removed unsaved markdown doc from form");
      setValue(
        "mdDocumentation",
        formValues.mdDocumentation.filter((doc, idx) => idx !== docId),
        { shouldValidate: true }
      );
      return;
    }
    if (!window.confirm("Delete this markdown documentation?")) return;
    try {
      console.log(`[DEBUG] Attempting to delete markdown doc with _id: ${docId}`);
      await myProjectWorksAPI.deleteMdDocument(id, docId);
      setExistingDocs(prev => prev.filter(doc => doc._id !== docId));
      // Also remove from kept existing docs
      setKeptExistingDocs(prev => prev.filter(doc => doc._id !== docId));
      toast.success("Markdown documentation deleted");
      console.log(`[DEBUG] Successfully deleted markdown doc with _id: ${docId}`);
    } catch (err) {
      toast.error("Failed to delete markdown documentation");
      console.error("[DEBUG] Failed to delete markdown doc", err);
    }
  };

  // Handle category type change
  const handleCategoryTypeChange = e => {
    const type = e.target.value;
    console.log("🔄 [Category] Type changed to:", type);

    setValue("categoryType", type, { shouldValidate: true });

    if (type === "predefined") {
      // Reset category when switching to predefined
      setValue("category", "", { shouldValidate: true });
      console.log("🔄 [Category] Reset category for predefined");
    } else if (type === "other") {
      // Clear category when switching to other
      setValue("category", "", { shouldValidate: true });
      console.log("🔄 [Category] Reset category for custom");
    }

    // Trigger validation for category field
    setTimeout(() => {
      trigger("category");
    }, 100);
  };

  // Handle predefined category selection
  const handlePredefinedCategoryChange = e => {
    const selectedCategory = e.target.value;
    console.log("🔄 [Category] Predefined category selected:", selectedCategory);

    setValue("category", selectedCategory, { shouldValidate: true });
    setValue("categoryType", "predefined", { shouldValidate: true });
  };

  // Handle custom category input
  const handleCustomCategoryChange = e => {
    const customCategory = e.target.value;
    console.log("🔄 [Category] Custom category entered:", customCategory);

    setValue("category", customCategory, { shouldValidate: true });
    setValue("categoryType", "other", { shouldValidate: true });
  };

  // Handle form submit with validation
  const onSubmit = async data => {
    try {
      setSubmitting(true);
      setError("");

      // Enhanced category validation
      let finalCategory = data.category;

      if (data.categoryType === "predefined") {
        if (!data.category || !PREDEFINED_CATEGORIES.includes(data.category)) {
          toast.error("Please select a valid predefined category");
          return;
        }
        finalCategory = data.category;
      } else if (data.categoryType === "other") {
        if (!data.category || data.category.trim().length < 2) {
          toast.error("Please enter a valid custom category (at least 2 characters)");
          return;
        }
        finalCategory = data.category.trim();
      } else {
        toast.error("Please select a category type");
        return;
      }

      console.log("📝 [Form] Submitting data:", {
        ...data,
        category: finalCategory,
        categoryType: data.categoryType,
      });

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", finalCategory);
      formData.append("categoryType", data.categoryType);
      formData.append("overview", data.overview);
      formData.append("documentation", data.documentation);
      formData.append("technology", data.technology);
      formData.append("liveWebsite", data.liveWebsite || "");
      formData.append("liveWebsiteRepo", data.liveWebsiteRepo || "");
      formData.append("liveServersite", data.liveServersite || "");
      formData.append("liveServersiteRepo", data.liveServersiteRepo || "");

      // Add screenshots
      if (data.screenshots && data.screenshots.length > 0) {
        data.screenshots.forEach(file => {
          formData.append("screenshots", file);
        });
      }

      // Add current existing images (after deletions) by their _id or url
      // if (existingImages && existingImages.length > 0) {
      //   // Prefer _id, fallback to url
      //   formData.append(
      //     "existingImages",
      //     JSON.stringify(existingImages.map(img => img._id || img.url))
      //   );
      // }
      if (existingImages && existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages.map(img => img.public_id)));
      }

      // Combine kept existing docs and new docs into a single array
      let allMdDocumentation = [];

      // Add kept existing docs (with their original _id)
      if (keptExistingDocs && keptExistingDocs.length > 0) {
        allMdDocumentation = [...keptExistingDocs];
      }

      // Add new docs (without _id, they will get new _id from backend)
      if (data.mdDocumentation && data.mdDocumentation.length > 0) {
        allMdDocumentation = [...allMdDocumentation, ...data.mdDocumentation];
      }

      // Send the combined array as mdDocumentation
      if (allMdDocumentation.length > 0) {
        formData.append("mdDocumentation", JSON.stringify(allMdDocumentation));
        console.log("📤 [Form] Sending combined mdDocumentation:", {
          keptExistingDocs: keptExistingDocs.length,
          newDocs: data.mdDocumentation.length,
          totalDocs: allMdDocumentation.length,
          combinedDocs: allMdDocumentation,
        });
      } else {
        console.log("📤 [Form] No mdDocumentation to send");
      }

      let response;
      if (isEdit) {
        response = await myProjectWorksAPI.updateProjectWork(id, formData);
        toast.success("Project updated successfully!");
      } else {
        response = await myProjectWorksAPI.createProjectWork(formData);
        toast.success("Project created successfully!");
      }

      console.log("✅ [Form] Submit response:", response);
      navigate("/admin/dashboard/myprojectworks");
    } catch (err) {
      console.error("❌ [Form] Submit error:", err);
      setError(err?.response?.data?.message || "Failed to save project");
      toast.error("Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete markdown doc from state or backend+state, with debug logs and toast
  const handleDeleteMdDoc = async (doc, idx) => {
    if (doc._id) {
      // Database doc: remove from kept existing docs (will be deleted on update)
      if (!window.confirm("Delete this markdown documentation?")) return;
      try {
        console.log(`[DEBUG] Removing markdown doc with _id: ${doc._id} from kept existing docs`);
        setKeptExistingDocs(prev => prev.filter(d => d._id !== doc._id));
        setExistingDocs(prev => prev.filter(d => d._id !== doc._id));
        toast.success("Markdown documentation will be deleted on save");
        console.log(
          `[DEBUG] Successfully removed markdown doc with _id: ${doc._id} from kept existing docs`
        );
      } catch (err) {
        toast.error("Failed to remove markdown documentation");
        console.error("[DEBUG] Failed to remove markdown doc", err);
      }
    } else {
      // Unsaved doc: delete from state only
      setValue(
        "mdDocumentation",
        formValues.mdDocumentation.filter((_, i) => i !== idx),
        { shouldValidate: true }
      );
      toast.info("Removed unsaved markdown doc from form");
      console.log(`[DEBUG] Removed unsaved markdown doc at index ${idx} from form`);
    }
  };

  // Example: clear a field (e.g., title) of a markdown doc
  const clearMdDocField = (idx, field) => {
    handleMdDocChange(idx, field, "");
    toast.info(`Cleared ${field} of doc at index ${idx}`);
    console.log(`[DEBUG] Cleared ${field} of doc at index ${idx}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6" ref={formRef}>
      <div ref={topRef}></div>
      {/* Header with Back Button */}
      <div className="mb-6">
        <Link
          to="/admin/dashboard/myprojectworks"
          className="inline-flex items-center gap-2 text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-200 mb-4"
        >
          <FaArrowLeft />
          Back to Projects
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {isEdit ? "Edit Project" : "Create New Project"}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {isEdit ? "Update your project details" : "Add a new project to your portfolio"}
            </p>
            {isEdit && (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Project ID: {id} | URL: {window.location.pathname}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Debug Panel (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border">
          <h4 className="font-bold text-sm mb-2">🔍 Debug Info:</h4>
          <div className="text-xs space-y-1">
            <div>
              Category Type:{" "}
              <span className="font-mono">{formValues.categoryType || "undefined"}</span>
            </div>
            <div>
              Category: <span className="font-mono">{formValues.category || "undefined"}</span>
            </div>
            <div>
              Form Valid: <span className="font-mono">{isValid ? "true" : "false"}</span>
            </div>
            <div>
              Loading: <span className="font-mono">{loading ? "true" : "false"}</span>
            </div>
            <div>
              New Docs: <span className="font-mono">{formValues.mdDocumentation?.length || 0}</span>
            </div>
            <div>
              Kept Existing Docs: <span className="font-mono">{keptExistingDocs?.length || 0}</span>
            </div>
            <div>
              Total Docs to Send:{" "}
              <span className="font-mono">
                {(formValues.mdDocumentation?.length || 0) + (keptExistingDocs?.length || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1 text-[var(--text-primary)]">Project Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Project Name (required, 2-100 characters)"
            defaultValue={formValues.name}
            disabled={loading}
            className={getInputClassName(errors.name)}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        {/* Category */}
        <div>
          <label className="block font-medium mb-1 text-[var(--text-primary)]">Category</label>

          {/* Category Type Selection */}
          <div className="mb-3">
            <select
              {...register("categoryType")}
              value={formValues.categoryType || "predefined"}
              disabled={loading}
              className={`${getInputClassName(errors.categoryType)} mb-2`}
              onChange={handleCategoryTypeChange}
            >
              <option value="predefined">📋 Select from predefined categories</option>
              <option value="other">✏️ Write custom category</option>
            </select>
            {errors.categoryType && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryType.message}</p>
            )}
          </div>

          {/* Conditional Category Input */}
          {(() => {
            const currentCategoryType = formValues.categoryType || "predefined";
            console.log("🔄 [Category] Rendering for type:", currentCategoryType);

            if (currentCategoryType === "predefined") {
              return (
                <div>
                  <select
                    {...register("category")}
                    value={formValues.category || ""}
                    disabled={loading}
                    className={getInputClassName(errors.category)}
                    onChange={handlePredefinedCategoryChange}
                  >
                    <option value="">Choose a category... (required)</option>
                    {PREDEFINED_CATEGORIES.map((category, index) => (
                      <option key={index} value={category}>
                        {String(index + 1).padStart(2, "0")}. {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Select from our curated list of website categories
                  </p>
                </div>
              );
            } else {
              return (
                <div>
                  <input
                    type="text"
                    {...register("category")}
                    placeholder="Enter custom category (required, 2-50 characters, e.g., AI/ML Projects)"
                    value={formValues.category || ""}
                    disabled={loading}
                    className={getInputClassName(errors.category)}
                    onChange={handleCustomCategoryChange}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Enter a custom category that best describes your project (2-50 characters)
                  </p>
                </div>
              );
            }
          })()}
        </div>
        {/* Overview */}
        <div>
          <label className="block font-medium mb-1 text-[var(--text-primary)]">Overview</label>
          <textarea
            {...register("overview")}
            placeholder="Project Overview (required, 10-1000 characters)"
            defaultValue={formValues.overview}
            disabled={loading}
            className={`${getInputClassName(errors.overview)} min-h-[80px] resize-vertical`}
          />
          {errors.overview && (
            <p className="text-red-500 text-sm mt-1">{errors.overview.message}</p>
          )}
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
            placeholder="Technologies (required, comma separated, e.g., React, Node.js, MongoDB)"
            defaultValue={formValues.technology}
            disabled={loading}
            className={getInputClassName(errors.technology)}
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
            placeholder="Live Website URL (optional, must be a valid URL)"
            defaultValue={formValues.liveWebsite}
            disabled={loading}
            className={getInputClassName(errors.liveWebsite)}
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
            placeholder="Frontend Repo URL (optional, must be a valid URL)"
            defaultValue={formValues.liveWebsiteRepo}
            disabled={loading}
            className={getInputClassName(errors.liveWebsiteRepo)}
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
            placeholder="Backend Live URL (optional, must be a valid URL)"
            defaultValue={formValues.liveServersite}
            disabled={loading}
            className={getInputClassName(errors.liveServersite)}
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
            placeholder="Backend Repo URL (optional, must be a valid URL)"
            defaultValue={formValues.liveServersiteRepo}
            disabled={loading}
            className={getInputClassName(errors.liveServersiteRepo)}
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
                  <img
                    src={img.fullImageUrl || img.url}
                    alt="existing"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.public_id)}
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="block font-medium text-[var(--text-primary)]">
                Markdown Documentation
              </label>
              {formValues.mdDocumentation.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-[var(--primary-main)] text-white px-2 py-1 rounded">
                    {formValues.mdDocumentation.length} new file
                    {formValues.mdDocumentation.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {
                      formValues.mdDocumentation.filter((_, idx) => showMdPreview[`new-${idx}`])
                        .length
                    }{" "}
                    preview
                    {formValues.mdDocumentation.filter((_, idx) => showMdPreview[`new-${idx}`])
                      .length !== 1
                      ? "s"
                      : ""}{" "}
                    shown
                  </span>
                </div>
              )}
              {keptExistingDocs.length > 0 && (
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-sm bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] px-2 py-1 rounded">
                    {keptExistingDocs.length} kept existing file
                    {keptExistingDocs.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Show All / Hide All buttons - show if there are any docs (new or existing) */}
            {(formValues.mdDocumentation.length > 0 || keptExistingDocs.length > 0) && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleAllPreviews}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 flex items-center gap-1 ${
                    activeButton === "show-all" || areAllPreviewsShown()
                      ? "bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)] shadow-md"
                      : "bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] hover:bg-[var(--background-default)]"
                  }`}
                  title="Show all previews"
                >
                  <FaEye className="text-xs" />
                  Show All
                </button>
                <button
                  type="button"
                  onClick={hideAllPreviews}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 flex items-center gap-1 ${
                    activeButton === "hide-all" ||
                    (!areAnyPreviewsShown() && activeButton !== "show-all")
                      ? "bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)] shadow-md"
                      : "bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] hover:bg-[var(--background-default)]"
                  }`}
                  title="Hide all previews"
                >
                  <FaEyeSlash className="text-xs" />
                  Hide All
                </button>
              </div>
            )}
          </div>
          {isEdit && existingDocs.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-sm text-[var(--text-primary)]">
                    Existing Docs
                  </div>
                  <span className="text-xs bg-[var(--background-elevated)] text-[var(--text-secondary)] px-2 py-1 rounded border">
                    {existingDocs.length} file{existingDocs.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => existingMdFileInputRef.current?.click()}
                    className="px-3 py-1 bg-[var(--primary-main)] text-white rounded-lg text-sm hover:bg-[var(--primary-dark)] transition-colors duration-200 flex items-center gap-1"
                    title="Upload multiple .md files"
                  >
                    <FaUpload className="text-xs" />
                    Upload Multiple .md
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tempInput = document.createElement("input");
                      tempInput.type = "file";
                      tempInput.accept = ".md";
                      tempInput.multiple = true;
                      tempInput.onchange = e => handleMultipleMdFileUpload(e, "existing");
                      tempInput.click();
                    }}
                    className="px-3 py-1 bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg text-sm hover:bg-[var(--background-default)] transition-colors duration-200 flex items-center gap-1"
                    title="Upload single .md file"
                  >
                    <FaUpload className="text-xs" />
                    Upload Single .md
                  </button>
                </div>
              </div>
              <input
                type="file"
                accept=".md"
                multiple
                onChange={e => handleMultipleMdFileUpload(e, "existing")}
                ref={existingMdFileInputRef}
                className="hidden"
              />
              {existingDocs.map((doc, idx) => (
                <div
                  key={doc._id}
                  ref={el => (docRefs.current[`existing-${idx}`] = el)}
                  className="border border-[var(--border-main)] rounded-lg p-3 mb-3 bg-[var(--background-elevated)] relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-[var(--text-primary)]">{doc.title}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleMdPreview("existing", idx)}
                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        title={showMdPreview[`existing-${idx}`] ? "Hide Preview" : "Show Preview"}
                      >
                        {showMdPreview[`existing-${idx}`] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyMdContent(doc.content)}
                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        title="Copy Content"
                      >
                        <FaCopy />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          console.log(`[DEBUG] removeMdDocument called for doc._id: ${doc._id}`);
                          removeMdDocument(doc._id);
                        }}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToDoc(`existing-${idx}`)}
                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors hover:scale-110"
                        title="Scroll to this doc"
                      >
                        <FaArrowUp className="text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors hover:scale-110"
                        title="Scroll to bottom"
                      >
                        <FaArrowDown className="text-sm" />
                      </button>
                    </div>
                  </div>
                  {doc.slug && (
                    <div className="text-xs text-[var(--text-secondary)] mb-2">
                      Slug: {doc.slug}
                    </div>
                  )}
                  {showMdPreview[`existing-${idx}`] && (
                    <div className="border border-[var(--border-main)] rounded-lg overflow-hidden">
                      <MarkdownEditor value={doc.content} readOnly />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {formValues.mdDocumentation.map((doc, idx) => (
            <div
              key={idx}
              ref={el => (docRefs.current[`new-${idx}`] = el)}
              className="border border-[var(--border-main)] rounded-lg p-3-[var(--background-elevated)] relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[var(--text-primary)]">Documentation {idx + 1}</h4>
                  <span className="text-xs bg-[var(--primary-main)] text-white px-2">
                    {doc.title || "Untitled"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Create a temporary file input for multiple files
                      const tempInput = document.createElement("input");
                      tempInput.type = "file";
                      tempInput.accept = ".md";
                      tempInput.multiple = true;
                      tempInput.onchange = e => handleMultipleMdFileUpload(e, "new");
                      tempInput.click();
                    }}
                    className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    title="Upload multiple .md files"
                  >
                    <FaUpload />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Create a temporary file input for single file
                      const tempInput = document.createElement("input");
                      tempInput.type = "file";
                      tempInput.accept = ".md";
                      tempInput.onchange = e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = event => {
                            const content = event.target.result;
                            const fileName = file.name.replace(".md", "");
                            const newDoc = { title: fileName, content: content, slug: "" };
                            const newDocs = [...formValues.mdDocumentation, newDoc];
                            setValue("mdDocumentation", newDocs, { shouldValidate: true });

                            // Initialize preview state for new doc
                            const newIdx = newDocs.length - 1;
                            setShowMdPreview(prev => ({ ...prev, [`new-${newIdx}`]: false })); // Start hidden
                            toast.success(
                              "Markdown file uploaded successfully! Use Show/Hide buttons to manage previews."
                            );
                          };
                          reader.readAsText(file);
                        }
                      };
                      tempInput.click();
                    }}
                    className="px-4 bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg hover:bg-[var(--background-default)] transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaFileUpload className="text-sm" />
                    Upload Single .md File
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMdPreview("new", idx)}
                    className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    title={showMdPreview[`new-${idx}`] ? "Hide Preview" : "Show Preview"}
                  >
                    {showMdPreview[`new-${idx}`] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyMdContent(doc.content)}
                    className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    title="Copy Content"
                  >
                    <FaCopy />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log(`[DEBUG] removeMdDoc called for idx: ${idx}`);
                      removeMdDoc(idx);
                    }}
                    className="p-1 text-red-600 hover:text-red-700 transition-colors"
                    title="Remove (removeMdDoc)"
                  >
                    🗑️
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToDoc(`new-${idx}`)}
                    className="p-1 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors hover:scale-110"
                    title="Scroll to this doc"
                  >
                    <FaArrowUp className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="p-1 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors hover:scale-110"
                    title="Scroll to bottom"
                  >
                    <FaArrowDown className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Show full content only when preview is enabled */}
              {showMdPreview[`new-${idx}`] && (
                <>
                  <input
                    type="text"
                    value={doc.title}
                    onChange={e => handleMdDocChange(idx, "title", e.target.value)}
                    placeholder="Documentation Title (required)"
                    className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
                  />
                  <input
                    type="text"
                    value={doc.slug}
                    onChange={e => handleMdDocChange(idx, "slug", e.target.value)}
                    placeholder="Slug (optional)"
                    className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
                  />
                  <div className="border border-[var(--border-main)] rounded-lg overflow-hidden">
                    <MarkdownEditor
                      value={doc.content}
                      onChange={val => handleMdDocChange(idx, "content", val)}
                    />
                  </div>
                  <div className="mt-2 border border-[var(--border-main)] rounded-lg overflow-hidden">
                    <div className="p-2 bg-[var(--background-default)] border-b border-[var(--border-main)] text-sm font-medium text-[var(--text-primary)] flex items-center justify-between">
                      <span>Preview: {doc.title || "Untitled"}</span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {doc.content.length} characters
                      </span>
                    </div>
                    <MarkdownEditor value={doc.content} readOnly />
                  </div>
                </>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMdDoc}
            className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg mt-2 hover:bg-[var(--primary-dark)] transition-colors duration-200 font-medium"
          >
            Add Markdown Doc
          </button>

          {/* Multiple Upload Options */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                const tempInput = document.createElement("input");
                tempInput.type = "file";
                tempInput.accept = ".md";
                tempInput.multiple = true;
                tempInput.onchange = e => handleMultipleMdFileUpload(e, "new");
                tempInput.click();
              }}
              className="px-4 py-2 bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg hover:bg-[var(--background-default)] transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <FaUpload className="text-sm" />
              Upload Multiple .md Files
            </button>

            <button
              type="button"
              onClick={() => {
                const tempInput = document.createElement("input");
                tempInput.type = "file";
                tempInput.accept = ".md";
                tempInput.onchange = e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = event => {
                      const content = event.target.result;
                      const fileName = file.name.replace(".md", "");
                      const newDoc = { title: fileName, content: content, slug: "" };
                      const newDocs = [...formValues.mdDocumentation, newDoc];
                      setValue("mdDocumentation", newDocs, { shouldValidate: true });

                      // Initialize preview state for new doc
                      const newIdx = newDocs.length - 1;
                      setShowMdPreview(prev => ({ ...prev, [`new-${newIdx}`]: false })); // Start hidden
                      toast.success(
                        "Markdown file uploaded successfully! Use Show/Hide buttons to manage previews."
                      );
                    };
                    reader.readAsText(file);
                  }
                };
                tempInput.click();
              }}
              className="px-4 py-2 bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg hover:bg-[var(--background-default)] transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <FaFileUpload className="text-sm" />
              Upload Single .md File
            </button>

            {formValues.mdDocumentation.length > 0 && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-[var(--text-secondary)]">
                  📁 {formValues.mdDocumentation.length} new file
                  {formValues.mdDocumentation.length !== 1 ? "s" : ""} uploaded
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  👁️{" "}
                  {
                    formValues.mdDocumentation.filter((_, idx) => showMdPreview[`new-${idx}`])
                      .length
                  }{" "}
                  preview
                  {formValues.mdDocumentation.filter((_, idx) => showMdPreview[`new-${idx}`])
                    .length !== 1
                    ? "s"
                    : ""}{" "}
                  shown
                </span>
              </div>
            )}
            {(formValues.mdDocumentation.length > 0 || keptExistingDocs.length > 0) && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-[var(--text-secondary)] font-medium">
                  🎯 Total to save: {formValues.mdDocumentation.length + keptExistingDocs.length}{" "}
                  file
                  {formValues.mdDocumentation.length + keptExistingDocs.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--text-secondary)] mt-2">
            💡 Tip: You can upload multiple .md files at once or add them individually. Use "Show
            All" / "Hide All" buttons to manage previews. When you save, new files will be added to
            existing ones.
          </p>
        </div>
        {/* Submit */}
        <div className="flex gap-3 pt-6 border-t border-[var(--border-main)]">
          <Link
            to="/admin/dashboard/myprojectworks"
            className="px-6 py-3 bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg font-medium hover:bg-[var(--background-default)] transition-colors duration-200"
          >
            Cancel
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || !isValid || loading}
            className="flex-1 py-3 bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] text-white rounded-lg font-bold text-lg shadow-lg hover:from-[var(--primary-dark)] hover:to-[var(--primary-main)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Loading..."
              : submitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Project"
              : "Create Project"}
          </motion.button>
          {/* Error message if button is disabled due to invalid form */}
          {!isValid && !loading && !submitting && (
            <div className="text-red-500 text-sm mt-2 flex-1">
              Please fill all required fields correctly to enable the button.
            </div>
          )}
        </div>
      </form>
      {/* Scroll to Top/Bottom Buttons */}
      <div ref={bottomRef}></div>
      <div
        className="fixed right-4 z-50 flex flex-col gap-2"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <button
          type="button"
          className="p-3 bg-[var(--primary-main)] text-white rounded-full shadow-lg hover:bg-[var(--primary-dark)] transition-all duration-200 hover:scale-110 hover:shadow-xl"
          onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
          title="Scroll to Top"
        >
          <FaArrowUp className="text-lg" />
        </button>
        <button
          type="button"
          className="p-3 bg-[var(--primary-main)] text-white rounded-full shadow-lg hover:bg-[var(--primary-dark)] transition-all duration-200 hover:scale-110 hover:shadow-xl"
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          title="Scroll to Bottom"
        >
          <FaArrowDown className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default MyProjectWorksForm;
