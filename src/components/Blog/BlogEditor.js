import React, { useState, useEffect, useRef } from "react";
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
  const editorRef = useRef(null);
  const [showAuthorInfo, setShowAuthorInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
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
            category: data.category,
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

          const formDataToSet = {
            title: actualData.title || "",
            content: actualData.content || "",
            category: actualData.category || "",
            image: actualData.image || "",
            author: {
              name:
                authorData.name || user?.displayName || user?.email?.split("@")[0] || "Anonymous",
              email: authorData.email || user?.email || "",
              phone: authorData.phone || "",
              isHidden: authorData.isHidden || false,
            },
          };

          console.log("Setting form data:", formDataToSet);
          console.log("Form data title:", formDataToSet.title);
          console.log("Form data category:", formDataToSet.category);
          console.log("Form data image:", formDataToSet.image);

          setFormData(formDataToSet);
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
                key={`editor-${id || "new"}-${isDataLoaded ? "loaded" : "new"}`}
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                  setIsEditorReady(true);
                  console.log("TinyMCE editor initialized");

                  // Load content if available
                  if (formData.content && formData.content.trim()) {
                    console.log("Loading content during initialization");
                    editor.setContent(formData.content);
                  }
                }}
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
