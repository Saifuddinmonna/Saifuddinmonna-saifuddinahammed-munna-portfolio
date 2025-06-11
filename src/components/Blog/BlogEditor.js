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
  const { user } = useAuth();
  const [showAuthorInfo, setShowAuthorInfo] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    author: {
      name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
      email: user?.email || "",
      phone: "",
      isHidden: false,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const data = await blogService.getBlogById(id);
          console.log("Fetched blog data:", data);
          setFormData({
            title: data.title,
            content: data.content || "",
            category: data.category,
            image: data.image,
            author: {
              name:
                data.author.name || user?.displayName || user?.email?.split("@")[0] || "Anonymous",
              email: data.author.email || user?.email || "",
              phone: data.author.phone || "",
              isHidden: data.author.isHidden || false,
            },
          });
          setShowAuthorInfo(!data.author.isHidden);
        } catch (error) {
          console.error("Error fetching post:", error);
          toast.error("Failed to load post");
          navigate("/blog");
        }
      };
      fetchPost();
    }
  }, [id, navigate, user]);

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

  const handleSave = async e => {
    e.preventDefault(); // Prevent default form submission

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

      console.log("Sending data to server:", postData); // Debug log

      if (id) {
        await updateMutation.mutateAsync({ id, data: postData });
      } else {
        await createMutation.mutateAsync(postData);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="space-y-6">
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

          <div className="mb-6">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
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
              className="w-full px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            />
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
                  placeholder="Author Email (Optional)"
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
              <Editor
                apiKey="dlfn3zegy6zpe1fznqli3y0i6rkf4mlhpntqfq5vcqetdl5v"
                value={formData.content}
                onEditorChange={content => {
                  console.log("Editor content changed:", content);
                  setFormData(prev => ({
                    ...prev,
                    content: content,
                  }));
                }}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  branding: false,
                  promotion: false,
                  skin: localStorage.getItem("theme") === "dark" ? "oxide-dark" : "oxide",
                  content_css: localStorage.getItem("theme") === "dark" ? "dark" : "default",
                  entity_encoding: "raw",
                  encoding: "xml",
                  convert_urls: false,
                  relative_urls: false,
                  remove_script_host: false,
                  preserve_caret_position: true,
                  paste_data_images: true,
                  paste_as_text: false,
                  paste_word_valid_elements:
                    "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,br,ul,ol,li,a[href],span",
                  paste_retain_style_properties: "all",
                  paste_strip_class_attributes: false,
                  paste_remove_styles: false,
                  paste_remove_styles_if_webkit: false,
                  paste_preprocess: function (plugin, args) {
                    console.log("Paste preprocess:", args.content);
                  },
                  paste_postprocess: function (plugin, args) {
                    console.log("Paste postprocess:", args.node);
                  },
                }}
              />
            </div>

            <div className="flex justify-end mt-6">
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
