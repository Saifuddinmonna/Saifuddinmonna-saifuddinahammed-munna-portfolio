import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { blogCategoryAPI, createBlogMultipart, deleteBlogImage } from "../../services/apiService";
import { useAuth } from "../../auth/context/AuthContext";
import TinyMCEEditor from "../ui/TinyMCEEditor";
import Select, { components } from "react-select";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const [showAuthorInfo, setShowAuthorInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categories: [], // Changed from category to categories array
    tags: [], // Added tags array
    image: "",
    readTime: "",
    author: {
      name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
      email: user?.email || "",
      phone: "",
    },
    status: "published", // Added status field
  });
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  // Add state for image mode, file, preview, upload progress
  const [imageMode, setImageMode] = useState("url"); // "url" or "upload"
  const [imageUrl, setImageUrl] = useState(formData.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [originalImageObject, setOriginalImageObject] = useState(null); // Store original image object for deletion
  const fileInputRef = useRef();

  // Add state for tags
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // Handle tag input
  const handleTagInputChange = e => {
    setTagInput(e.target.value);
  };

  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove tag
  const handleRemoveTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input key press
  const handleTagKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Debug useEffect to monitor formData changes
  useEffect(() => {
    console.log("FormData changed:", formData);
    console.log("Current form values:");
    console.log("- Title:", formData.title);
    console.log("- Category:", formData.category);
    console.log("- Image:", formData.image);
    console.log("- Content length:", formData.content?.length || 0);
    console.log("- Author name:", formData.author?.name);
  }, [formData]);

  // Handle TinyMCE editor initialization
  useEffect(() => {
    if (isDataLoaded && isEditorReady && formData.content) {
      console.log("TinyMCE editor ready with content via value prop");
    }
  }, [isDataLoaded, isEditorReady, formData.content]);

  // Handle content updates after initial load
  useEffect(() => {
    if (isEditorReady && editorRef.current && formData.content && isDataLoaded) {
      const currentContent = editorRef.current.getContent();
      if (currentContent !== formData.content) {
        console.log("Updating editor content");
        editorRef.current.setContent(formData.content);
      }
    }
  }, [formData.content, isEditorReady, isDataLoaded]);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          setIsLoading(true);
          console.log("Fetching blog with ID:", id);

          const data = await blogService.getBlog(id);
          console.log("Fetched blog data:", data);
          console.log("Raw data type:", typeof data);
          console.log("Data structure:", {
            title: data.title,
            content: data.content,
            categories: data.categories,
            tags: data.tags,
            image: data.image,
            author: data.author,
            hasAuthor: !!data.author,
            authorName: data.author?.name,
            authorEmail: data.author?.email,
          });

          // Check if data is wrapped in another object
          const actualData = data.data || data;
          console.log("Actual data after unwrapping:", actualData);

          // Safe access to author data
          const authorData = actualData.author || {};
          console.log("Author data after safe access:", authorData);

          // Handle image - extract URL from image object or use string
          // Also handle cases where image object has null values
          const imageUrl =
            actualData.image?.url && actualData.image.url !== null
              ? actualData.image.url
              : typeof actualData.image === "string"
              ? actualData.image
              : "";

          // Store original image object for deletion - handle null/undefined cases
          const originalImage =
            actualData.image &&
            typeof actualData.image === "object" &&
            actualData.image.url &&
            actualData.image.url !== null &&
            actualData.image.public_id &&
            actualData.image.public_id !== null
              ? actualData.image
              : null;

          const formDataToSet = {
            title: actualData.title || "",
            content: actualData.content || "",
            categories: actualData.categories || [], // Changed to array
            tags: actualData.tags || [], // Added tags
            image: imageUrl,
            readTime: actualData.readTime || "",
            status: actualData.status || "published", // Added status
            author: {
              name:
                authorData.name || user?.displayName || user?.email?.split("@")[0] || "Anonymous",
              email: authorData.email || user?.email || "",
              phone: authorData.phone || "",
            },
          };

          console.log("=== FORM DATA SETTING DEBUG ===");
          console.log("Original categories from server:", actualData.categories);
          console.log("Categories type:", typeof actualData.categories);
          console.log("Categories value:", actualData.categories);
          console.log("Final categories in formData:", formDataToSet.categories);
          console.log("Tags:", formDataToSet.tags);
          console.log("=================================");

          console.log("Setting form data:", formDataToSet);
          console.log("Form data title:", formDataToSet.title);
          console.log("Form data categories:", formDataToSet.categories);
          console.log("Form data image:", formDataToSet.image);
          console.log("Original image object:", originalImage);

          setFormData(formDataToSet);
          setTags(formDataToSet.tags); // Set tags state
          setImageUrl(imageUrl); // Set image URL for preview
          setImageMode(imageUrl ? "url" : "upload"); // Set mode based on existing image
          setOriginalImageObject(originalImage); // Store original image object
          setShowAuthorInfo(!authorData.isHidden);
          setIsDataLoaded(true);

          console.log("Form data set successfully");
        } catch (error) {
          console.error("Error fetching post:", error);
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          toast.error("Failed to load post");
          navigate("/blog");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, navigate, user]);

  // Fetch categories from server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogCategoryAPI.getAllCategories();
        setCategories(data || []);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Ensure category is properly set when both blog data and categories are loaded
  useEffect(() => {
    if (isDataLoaded && categories.length > 0 && formData.category) {
      console.log("=== CATEGORY SYNC DEBUG ===");
      console.log("Blog data loaded:", isDataLoaded);
      console.log("Categories loaded:", categories.length);
      console.log("Current category:", formData.category);
      console.log(
        "Available category IDs:",
        categories.map(cat => cat._id)
      );
      console.log(
        "Category exists:",
        categories.some(cat => cat._id === formData.category)
      );
      console.log("===========================");
    }
  }, [isDataLoaded, categories, formData.category]);

  // Replace the groupedCategoryOptions logic with a recursive tree builder and flattener
  const buildCategoryTree = categories => {
    const map = {};
    categories.forEach(cat => {
      map[cat._id] = { ...cat, children: [] };
    });
    const roots = [];
    categories.forEach(cat => {
      if (cat.parent && map[cat.parent]) {
        map[cat.parent].children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });
    return roots;
  };

  // Flatten the tree for react-select, preserving depth
  const flattenCategories = (nodes, depth = 0) => {
    let result = [];
    nodes.forEach(node => {
      result.push({
        value: node._id,
        label: node.name + (node.children.length > 0 ? ` (${node.children.length})` : ""),
        depth,
        isParent: node.children.length > 0,
        node,
      });
      if (node.children.length > 0) {
        result = result.concat(flattenCategories(node.children, depth + 1));
      }
    });
    return result;
  };

  const categoryTree = React.useMemo(() => buildCategoryTree(categories), [categories]);
  const flatCategoryOptions = React.useMemo(() => flattenCategories(categoryTree), [categoryTree]);

  const groupedCategoryOptions = React.useMemo(
    () => [
      {
        label: "Categories",
        options: flatCategoryOptions,
      },
    ],
    [flatCategoryOptions]
  );

  // Update Option component to indent by depth and bold parents
  const Option = props => (
    <components.Option {...props}>
      <span
        style={{
          fontWeight: props.data.isParent ? "bold" : "normal",
          paddingLeft: 16 * (props.data.depth || 0),
          opacity: props.data.isParent ? 1 : 0.85,
        }}
      >
        {props.label}
      </span>
    </components.Option>
  );

  // Find selected option for react-select (by id)
  const selectedCategoryOption = React.useMemo(() => {
    console.log("=== CATEGORY SELECTION DEBUG ===");
    console.log("formData.category:", formData.category);
    console.log("categories loaded:", categories.length);
    console.log("flatCategoryOptions:", flatCategoryOptions.length);
    console.log(
      "Available options:",
      flatCategoryOptions.map(opt => ({ value: opt.value, label: opt.label }))
    );

    const found = groupedCategoryOptions
      .flatMap(group => group.options)
      .find(option => option.value === formData.category);

    console.log("Found option:", found);
    console.log("================================");

    return found || null;
  }, [formData.category, groupedCategoryOptions]);

  // Update category selection to handle array
  const handleCategoryChange = selectedOptions => {
    if (Array.isArray(selectedOptions)) {
      // Multiple selection
      const categoryIds = selectedOptions.map(option => option.value);
      setFormData(prev => ({ ...prev, categories: categoryIds }));
    } else if (selectedOptions) {
      // Single selection
      setFormData(prev => ({ ...prev, categories: [selectedOptions.value] }));
    } else {
      // No selection
      setFormData(prev => ({ ...prev, categories: [] }));
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("author.")) {
      const authorField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      toast.success("Blog post created successfully!");
      navigate("/blog");
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Failed to create blog post");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      toast.success("Blog post updated successfully!");
      navigate("/blog");
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Failed to update blog post");
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: ({ blogId, imageObject }) => deleteBlogImage(blogId, imageObject),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      queryClient.invalidateQueries(["admin-blogs"]);
      toast.success("Image deleted successfully!");
      // Clear the image from the form
      setImageUrl("");
      setImageFile(null);
      setOriginalImageObject(null);
      setFormData(prev => ({ ...prev, image: "" }));
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Failed to delete image");
    },
  });

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please enter some content");
      return;
    }
    if (!formData.categories.length) {
      toast.error("Please select at least one category");
      return;
    }
    if (!formData.author.name.trim()) {
      toast.error("Please enter author name");
      return;
    }

    setIsSaving(true);
    try {
      console.log("=== SUBMIT DEBUG ===");
      console.log("imageMode:", imageMode);
      console.log("imageFile:", imageFile);
      console.log("imageUrl:", imageUrl);
      console.log("imageFile instanceof File:", imageFile instanceof File);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);

      // Handle categories as array
      formData.categories.forEach(categoryId => {
        formDataToSend.append("categories", categoryId);
      });

      // Handle tags as array
      tags.forEach(tag => {
        formDataToSend.append("tags", tag);
      });

      formDataToSend.append("authorName", formData.author.name);
      formDataToSend.append("authorEmail", formData.author.email);
      formDataToSend.append("authorPhone", formData.author.phone);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("readTime", formData.readTime);

      if (imageMode === "upload" && imageFile) {
        console.log("=== IMAGE FILE DEBUG ===");
        console.log("imageFile type:", typeof imageFile);
        console.log("imageFile instanceof File:", imageFile instanceof File);
        console.log("imageFile name:", imageFile.name);
        console.log("imageFile size:", imageFile.size);
        console.log("imageFile type (mime):", imageFile.type);
        console.log("========================");

        formDataToSend.append("image", imageFile); // Send the actual file

        // Log FormData entries
        console.log("=== FORMDATA ENTRIES ===");
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, typeof value === "object" ? `File: ${value.name}` : value);
        }
        console.log("=========================");
      } else if (imageMode === "url" && imageUrl) {
        formDataToSend.append("image", imageUrl); // Send the URL string
        console.log("Sending image URL:", imageUrl);
      }

      console.log("=== FINAL FORMDATA CHECK ===");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, typeof value === "object" ? `File: ${value.name}` : value);
      }
      console.log("===========================");

      await createBlogMultipart(formDataToSend);

      toast.success("Blog post created successfully!");
      navigate("/blog");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  // Drag and drop handlers
  const handleDrop = e => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  const handleDragOver = e => e.preventDefault();

  // File input handler
  const handleFileChange = file => {
    console.log("=== FILE CHANGE DEBUG ===");
    console.log("Received file:", file);
    console.log("File type:", typeof file);
    console.log("File instanceof File:", file instanceof File);
    console.log("File name:", file?.name);
    console.log("File size:", file?.size);

    if (!file) {
      console.log("No file received");
      return;
    }

    setImageFile(file);
    const fileUrl = URL.createObjectURL(file);
    setImageUrl(fileUrl); // For preview
    setFormData(prev => ({ ...prev, image: fileUrl })); // Update formData.image too
    setUploadError(null);

    console.log("=== AFTER SETTING STATE ===");
    console.log("imageFile will be set to:", file);
    console.log("imageUrl will be set to:", fileUrl);
    console.log("===========================");
  };

  // Add this useEffect to monitor imageFile state
  useEffect(() => {
    console.log("=== IMAGEFILE STATE CHANGED ===");
    console.log("imageFile:", imageFile);
    console.log("imageFile type:", typeof imageFile);
    console.log("imageFile instanceof File:", imageFile instanceof File);
    console.log("imageFile name:", imageFile?.name);
    console.log("===============================");
  }, [imageFile]);

  // Handle image deletion
  const handleDeleteImage = async () => {
    if (!id) {
      toast.error("Blog ID not found");
      return;
    }

    if (!originalImageObject || !originalImageObject.url || !originalImageObject.public_id) {
      toast.error("No valid image to delete");
      return;
    }

    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImageMutation.mutateAsync({
          blogId: id,
          imageObject: originalImageObject,
        });
      } catch (error) {
        console.error("Delete image error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {isLoading && (
          <div className="mb-6 p-4 bg-[var(--background-paper)] rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-main)]"></div>
              <span className="ml-3 text-[var(--text-primary)]">Loading blog post...</span>
            </div>
          </div>
        )}

        {/* Data Loaded Indicator */}
        {!isLoading && id && isDataLoaded && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow-lg">
            <div className="text-green-800 dark:text-green-200">
              <h3 className="font-bold mb-2">✅ Data Loaded Successfully:</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Title:</strong> {formData.title || "Not loaded"}
                </p>
                <p>
                  <strong>Category:</strong> {formData.category || "Not loaded"}
                </p>
                <p>
                  <strong>Image:</strong> {formData.image || "Not loaded"}
                </p>
                <p>
                  <strong>Content Length:</strong> {formData.content?.length || 0} characters
                </p>
                <p>
                  <strong>Author:</strong> {formData.author?.name || "Not loaded"}
                </p>
                <p>
                  <strong>Editor Ready:</strong> {isEditorReady ? "✅ Yes" : "⏳ Loading..."}
                </p>
              </div>
              <p className="text-xs mt-2 italic">You can now edit the fields without reloading</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              className="w-full px-4 py-2 text-2xl font-bold bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] mb-2">
              Categories <span className="text-red-500">*</span>
            </label>
            <Select
              options={groupedCategoryOptions}
              value={flatCategoryOptions.filter(option =>
                formData.categories.includes(option.value)
              )}
              onChange={handleCategoryChange}
              isSearchable
              placeholder="Select one or more categories (required)"
              classNamePrefix="react-select"
              required
              components={{ Option }}
              isMulti // Enable multiple selection
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: "var(--background-paper)",
                  borderColor: state.isFocused ? "var(--primary-main)" : "var(--border-main)",
                  borderWidth: "1px",
                  borderRadius: "8px",
                  minHeight: "44px",
                  boxShadow: state.isFocused ? "0 0 0 2px var(--primary-main)" : "none",
                  "&:hover": {
                    borderColor: "var(--primary-main)",
                  },
                }),
                menu: provided => ({
                  ...provided,
                  backgroundColor: "var(--background-paper)",
                  border: "1px solid var(--border-main)",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "var(--primary-main)"
                    : state.isFocused
                    ? "var(--background-default)"
                    : "transparent",
                  color: state.isSelected ? "white" : "var(--text-primary)",
                  "&:hover": {
                    backgroundColor: state.isSelected
                      ? "var(--primary-dark)"
                      : "var(--background-default)",
                  },
                }),
                multiValue: provided => ({
                  ...provided,
                  backgroundColor: "var(--primary-light)",
                }),
                multiValueLabel: provided => ({
                  ...provided,
                  color: "var(--primary-dark)",
                }),
                multiValueRemove: provided => ({
                  ...provided,
                  color: "var(--primary-dark)",
                  "&:hover": {
                    backgroundColor: "var(--primary-main)",
                    color: "white",
                  },
                }),
                singleValue: provided => ({
                  ...provided,
                  color: "var(--text-primary)",
                }),
                input: provided => ({
                  ...provided,
                  color: "var(--text-primary)",
                }),
                placeholder: provided => ({
                  ...provided,
                  color: "var(--text-secondary)",
                }),
                indicatorSeparator: provided => ({
                  ...provided,
                  backgroundColor: "var(--border-main)",
                }),
                dropdownIndicator: provided => ({
                  ...provided,
                  color: "var(--text-secondary)",
                  "&:hover": {
                    color: "var(--text-primary)",
                  },
                }),
                clearIndicator: provided => ({
                  ...provided,
                  color: "var(--text-secondary)",
                  "&:hover": {
                    color: "var(--text-primary)",
                  },
                }),
              }}
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Please select <b>at least one category</b>. You can select multiple categories by
              clicking or holding Ctrl (Windows) or Cmd (Mac) while selecting.
            </p>
            {formData.categories.length === 0 && (
              <p className="text-xs text-red-500 mt-1">At least one category is required.</p>
            )}
            {/* Debug info for category selection */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-2 text-xs text-[var(--text-secondary)] bg-[var(--background-paper)] p-3 rounded-lg border border-[var(--border-main)]">
                <p className="mb-1">
                  <strong>Selected category IDs:</strong> {formData.categories.join(", ") || "None"}
                </p>
                <p className="mb-1">
                  <strong>Selected options:</strong>{" "}
                  {flatCategoryOptions
                    .filter(option => formData.categories.includes(option.value))
                    .map(opt => opt.label)
                    .join(", ") || "None"}
                </p>
                <p>
                  <strong>Categories loaded:</strong> {categories.length}
                </p>
              </div>
            )}
          </div>

          {/* Tags Input */}
          <div className="mb-4">
            <label className="block text-[var(--text-primary)] font-semibold mb-2">Tags</label>
            <div className="space-y-2">
              {/* Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary-light)] text-[var(--primary-dark)] rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[var(--text-primary)] font-semibold mb-2">
              Read Time (e.g., 5 min read)
            </label>
            <input
              type="text"
              name="readTime"
              value={formData.readTime}
              onChange={handleInputChange}
              placeholder="Enter read time (e.g., 5 min read)"
              className="w-full px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[var(--text-primary)] font-semibold mb-2">
              Blog Image
            </label>
            <div className="flex gap-4 mb-3">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  imageMode === "url"
                    ? "bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
                    : "bg-[var(--background-paper)] text-[var(--text-secondary)] border border-[var(--border-main)] hover:bg-[var(--background-default)]"
                }`}
                onClick={() => setImageMode("url")}
              >
                Image URL
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  imageMode === "upload"
                    ? "bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
                    : "bg-[var(--background-paper)] text-[var(--text-secondary)] border border-[var(--border-main)] hover:bg-[var(--background-default)]"
                }`}
                onClick={() => setImageMode("upload")}
              >
                Upload Image
              </button>
            </div>
            {imageMode === "url" ? (
              <input
                type="text"
                className="w-full px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
                placeholder="Paste image URL..."
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            ) : (
              <div
                className="w-full border-2 border-dashed border-[var(--border-main)] rounded-lg p-6 text-center cursor-pointer bg-[var(--background-paper)] hover:bg-[var(--background-default)] transition-colors duration-200"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                style={{ minHeight: 120 }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="mx-auto max-h-32 rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="text-[var(--text-secondary)]">
                    <div className="text-lg mb-2">📁</div>
                    <div className="font-medium text-[var(--text-primary)] mb-1">
                      Drag & drop or click to select an image
                    </div>
                    <div className="text-sm">Supports: JPG, PNG, GIF, WebP</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={e => handleFileChange(e.target.files[0])}
                />
                {uploadError && (
                  <div className="text-red-500 mt-3 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {uploadError}
                  </div>
                )}
              </div>
            )}
            {imageUrl && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img
                    src={imageUrl}
                    alt="Selected"
                    className="max-h-32 rounded-lg shadow-lg mx-auto border border-[var(--border-main)]"
                  />
                  {/* Delete button - only show for existing blogs with valid original image object */}
                  {id &&
                    originalImageObject &&
                    originalImageObject.url &&
                    originalImageObject.public_id && (
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        disabled={deleteImageMutation.isPending}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete image"
                      >
                        ×
                      </button>
                    )}
                </div>
                {/* Show delete button info for existing blogs with valid image object */}
                {id &&
                  originalImageObject &&
                  originalImageObject.url &&
                  originalImageObject.public_id && (
                    <div className="text-center mt-3">
                      <p className="text-sm text-[var(--text-secondary)] bg-[var(--background-paper)] p-2 rounded-lg border border-[var(--border-main)]">
                        Click the red × button to delete this image
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showAuthorInfo"
                checked={showAuthorInfo}
                onChange={e => setShowAuthorInfo(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showAuthorInfo" className="text-[var(--text-primary)]">
                Show Author Information
              </label>
            </div>

            {showAuthorInfo && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="author.name"
                  value={formData.author.name}
                  onChange={handleInputChange}
                  placeholder="Author Name (Required)"
                  className="w-full px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                />
                <input
                  type="email"
                  name="author.email"
                  value={formData.author.email}
                  onChange={handleInputChange}
                  placeholder="Author Email (Required)"
                  className="w-full px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                />
                <input
                  type="tel"
                  name="author.phone"
                  value={formData.author.phone}
                  onChange={handleInputChange}
                  placeholder="Author Phone (Optional)"
                  className="w-full px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                />
              </div>
            )}
          </div>

          <div className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg">
            <div>
              <label className="block text-[var(--text-primary)] mb-2">Content</label>
              <TinyMCEEditor
                key={`editor-${id || "new"}-${isDataLoaded ? "loaded" : "new"}`}
                value={formData.content}
                onChange={content => {
                  console.log("Editor content changed:", content);
                  setFormData(prev => ({
                    ...prev,
                    content: content,
                  }));
                }}
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                  setIsEditorReady(true);
                  console.log("TinyMCE editor initialized");
                  if (formData.content && formData.content.trim()) {
                    console.log("Loading content during initialization");
                    editor.setContent(formData.content);
                  }
                }}
                init={
                  {
                    // You can pass additional or override config here if needed
                  }
                }
              />
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              {process.env.NODE_ENV === "development" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Current form data:", formData);
                      console.log("Current content length:", formData.content.length);
                      toast.success("Check console for form data");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Debug Data
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const testData = await blogService.getBlog(id);
                        console.log("API Test Response:", testData);
                        console.log("Author data:", testData.author);
                        toast.success("Check console for API response");
                      } catch (error) {
                        console.error("API Test Error:", error);
                        toast.error("API test failed");
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Test API
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("=== FORM FIELD VALUES ===");
                      console.log("Title:", formData.title);
                      console.log("Content:", formData.content);
                      console.log("Category:", formData.category);
                      console.log("Image:", formData.image);
                      console.log("Author Name:", formData.author.name);
                      console.log("Author Email:", formData.author.email);
                      console.log("Author Phone:", formData.author.phone);
                      console.log("Show Author Info:", showAuthorInfo);
                      console.log("Is Loading:", isLoading);
                      console.log("Blog ID:", id);
                      console.log("========================");
                      toast.success("Form field values logged to console");
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Check Fields
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (id) {
                        setIsLoading(true);
                        try {
                          const data = await blogService.getBlog(id);
                          console.log("Force refresh - Raw data:", data);
                          const actualData = data.data || data;
                          console.log("Force refresh - Actual data:", actualData);

                          setFormData({
                            title: actualData.title || "",
                            content: actualData.content || "",
                            category: actualData.category || "",
                            image: actualData.image || "",
                            readTime: actualData.readTime || "",
                            author: {
                              name:
                                actualData.author?.name ||
                                user?.displayName ||
                                user?.email?.split("@")[0] ||
                                "Anonymous",
                              email: actualData.author?.email || user?.email || "",
                              phone: actualData.author?.phone || "",
                              isHidden: actualData.author?.isHidden || false,
                            },
                          });
                          toast.success("Data refreshed successfully");
                        } catch (error) {
                          console.error("Force refresh error:", error);
                          toast.error("Failed to refresh data");
                        } finally {
                          setIsLoading(false);
                        }
                      }
                    }}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
                  >
                    Force Refresh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("=== TINYMCE EDITOR STATUS ===");
                      console.log("Blog ID:", id);
                      console.log("Content Length:", formData.content?.length || 0);
                      console.log("Is Data Loaded:", isDataLoaded);
                      console.log("Editor Ref:", editorRef.current);
                      if (editorRef.current) {
                        console.log("Editor Content:", editorRef.current.getContent());
                        console.log(
                          "Editor Content Length:",
                          editorRef.current.getContent().length
                        );
                      }
                      console.log("=============================");
                      toast.success("TinyMCE status logged to console");
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                  >
                    Check Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editorRef.current && formData.content) {
                        console.log("Manually setting content in editor");
                        editorRef.current.setContent(formData.content);
                        toast.success("Content manually set in editor");
                      } else {
                        toast.error("Editor not ready or no content");
                      }
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                  >
                    Set Content
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editorRef.current) {
                        console.log("=== CURSOR POSITION TEST ===");
                        const selection = editorRef.current.selection;
                        const cursorPos = selection.getRng();
                        console.log("Cursor position:", cursorPos);
                        console.log("Content length:", editorRef.current.getContent().length);

                        // Move cursor to end
                        const body = editorRef.current.getBody();
                        const lastNode = body.lastChild;
                        if (lastNode) {
                          selection.setCursorLocation(lastNode, -1);
                          console.log("Cursor moved to end");
                          toast.success("Cursor moved to end of content");
                        }
                      } else {
                        toast.error("Editor not ready");
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    Fix Cursor
                  </button>
                </>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : id ? "Update Post" : "Save Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
