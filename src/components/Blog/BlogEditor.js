import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../auth/context/AuthContext";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const [showAuthorInfo, setShowAuthorInfo] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    author: {
      name: currentUser?.displayName || "",
      email: currentUser?.email || "",
      phone: "",
      isHidden: false,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch blog data if editing
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const data = await blogService.getBlogById(id);
          setFormData({
            title: data.title,
            content: data.content,
            category: data.category,
            image: data.image,
            author: {
              name: data.author.name,
              email: data.author.email || "",
              phone: data.author.phone || "",
              isHidden: data.author.isHidden || false,
            },
          });
          setShowAuthorInfo(!data.author.isHidden);
        } catch (error) {
          toast.error("Failed to fetch blog post");
          navigate("/blog");
        }
      };
      fetchBlog();
    }
  }, [id, navigate]);

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

  const handleEditorChange = content => {
    setFormData(prev => ({
      ...prev,
      content,
    }));
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

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please enter some content");
      return;
    }
    if (!formData.category.trim()) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.author.name.trim()) {
      toast.error("Please enter author name");
      return;
    }

    setIsSaving(true);
    try {
      const postData = {
        ...formData,
        date: new Date().toISOString(),
        readTime: `${Math.ceil(formData.content.split(" ").length / 200)} min read`,
        author: {
          ...formData.author,
          isHidden: !showAuthorInfo,
        },
      };

      if (id) {
        await updateMutation.mutateAsync({ id, data: postData });
      } else {
        await createMutation.mutateAsync(postData);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[var(--background-paper)] rounded-xl shadow-lg">
      <div className="mb-6">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter blog title"
          className="w-full px-4 py-2 text-2xl font-bold bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
        />
      </div>

      <div className="mb-6">
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
        >
          <option value="">Select Category</option>
          <option value="Web Development">Web Development</option>
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="Database">Database</option>
        </select>
      </div>

      <div className="mb-6">
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="Enter image URL"
          className="w-full px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
        />
      </div>

      {/* Author Information */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Author Information</h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAuthorInfo}
              onChange={e => setShowAuthorInfo(e.target.checked)}
              className="form-checkbox h-5 w-5 text-[var(--primary-main)]"
            />
            <span className="text-[var(--text-primary)]">Show Author Information</span>
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
              className="w-full px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            />
            <input
              type="email"
              name="author.email"
              value={formData.author.email}
              onChange={handleInputChange}
              placeholder="Author Email (Optional)"
              className="w-full px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            />
            <input
              type="tel"
              name="author.phone"
              value={formData.author.phone}
              onChange={handleInputChange}
              placeholder="Author Phone (Optional)"
              className="w-full px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <Editor
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
          initialValue={formData.content}
          value={formData.content}
          onEditorChange={handleEditorChange}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              "anchor",
              "autolink",
              "charmap",
              "codesample",
              "emoticons",
              "image",
              "link",
              "lists",
              "media",
              "searchreplace",
              "table",
              "visualblocks",
              "wordcount",
              "checklist",
              "mediaembed",
              "casechange",
              "formatpainter",
              "pageembed",
              "a11ychecker",
              "tinymcespellchecker",
              "permanentpen",
              "powerpaste",
              "advtable",
              "advcode",
              "editimage",
              "advtemplate",
              "ai",
              "mentions",
              "tinycomments",
              "tableofcontents",
              "footnotes",
              "mergetags",
              "autocorrect",
              "typography",
              "inlinecss",
              "markdown",
              "importword",
              "exportword",
              "exportpdf",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
            mergetags_list: [
              { value: "First.Name", title: "First Name" },
              { value: "Email", title: "Email" },
            ],
            ai_request: (request, respondWith) =>
              respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            skin: "oxide",
            content_css: "default",
          }}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate("/blog")}
          className="px-6 py-2 bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-hover)] transition-colors duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : id ? "Update Post" : "Save Post"}
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
