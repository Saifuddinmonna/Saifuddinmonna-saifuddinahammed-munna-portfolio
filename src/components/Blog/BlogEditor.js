import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BlogEditor = ({ post, onSave }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [category, setCategory] = useState(post?.category || "");
  const [image, setImage] = useState(post?.image || "");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleEditorChange = content => {
    setContent(content);
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
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
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
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="Enter image URL"
          className="w-full px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
        />
      </div>

      <div className="mb-6">
        <Editor
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
          initialValue={content}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              // Core editing features
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
              // Premium features
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
          {isSaving ? "Saving..." : "Save Post"}
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
