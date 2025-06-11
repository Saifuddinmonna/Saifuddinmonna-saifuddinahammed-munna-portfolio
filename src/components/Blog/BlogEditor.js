import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BlogEditor = ({ post, onSave }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [category, setCategory] = useState(post?.category || "");
  const [image, setImage] = useState(post?.image || "");
  const [isSaving, setIsSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image", "code-block"],
        ["clean"],
        ["copy", "paste"],
      ],
      handlers: {
        copy: function () {
          const range = this.quill.getSelection();
          if (range) {
            const text = this.quill.getText(range.index, range.length);
            navigator.clipboard.writeText(text);
            toast.success("Text copied to clipboard!");
          }
        },
        paste: function () {
          navigator.clipboard.readText().then(text => {
            const range = this.quill.getSelection();
            if (range) {
              this.quill.insertText(range.index, text);
            }
          });
        },
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "code-block",
  ];

  const categories = [
    "Web Development",
    "JavaScript",
    "React",
    "Node.js",
    "Database",
    "UI/UX Design",
    "Mobile Development",
    "DevOps",
    "Cloud Computing",
    "Artificial Intelligence",
  ];

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      categories.push(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      toast.success("New category added!");
    } else {
      toast.error("Category already exists or is invalid");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }
    if (!category.trim()) {
      toast.error("Please select a category");
      return;
    }

    setIsSaving(true);
    try {
      const postData = {
        title,
        content,
        category,
        image,
        date: new Date().toISOString(),
        readTime: `${Math.ceil(content.split(" ").length / 200)} min read`,
      };

      await onSave(postData);
      toast.success("Blog post saved successfully!");
      navigate("/blog");
    } catch (error) {
      toast.error("Failed to save blog post");
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
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="w-full px-4 py-2 text-2xl font-bold bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
        />
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1 px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Add new category"
              className="px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="Enter image URL"
          className="w-full px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
        />
      </div>

      <div className="mb-6">
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          className="h-96 mb-12 bg-[var(--background-default)] text-[var(--text-primary)]"
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
          {isSaving ? "Saving..." : "Save Post"}
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
