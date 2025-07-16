import React, { useState, useEffect, useContext } from "react";
import { FaFilePdf, FaFileWord, FaVideo } from "react-icons/fa";
import TinyMCEEditor from "../../../../ui/TinyMCEEditor";
import FileUpload from "./FileUpload";
import { ThemeContext } from "../../../../../App";
import { theme } from "../../../../../theme/theme";

const ResumeFormModal = ({ open, onClose, onSubmit, initialData, isEdit }) => {
  // Theme context
  const { isDarkMode } = useContext(ThemeContext);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  // Debug theme state
  console.log("ResumeFormModal Theme:", {
    isDarkMode,
    currentTheme: currentTheme.background.paper,
  });

  // Dynamic theme variables with proper CSS variable fallbacks
  const themeStyles = {
    modal: {
      backgroundColor: isDarkMode ? "rgb(30, 41, 59)" : "rgb(255, 255, 255)", // slate-800 : white
      color: isDarkMode ? "rgb(248, 250, 252)" : "rgb(17, 24, 39)", // slate-50 : gray-900
      borderColor: isDarkMode ? "rgb(51, 65, 85)" : "rgb(209, 213, 219)", // slate-700 : gray-300
    },
    input: {
      backgroundColor: isDarkMode ? "rgb(30, 41, 59)" : "rgb(255, 255, 255)", // slate-800 : white
      color: isDarkMode ? "rgb(248, 250, 252)" : "rgb(17, 24, 39)", // slate-50 : gray-900
      borderColor: isDarkMode ? "rgb(51, 65, 85)" : "rgb(209, 213, 219)", // slate-700 : gray-300
      "::placeholder": {
        color: isDarkMode ? "rgb(148, 163, 184)" : "rgb(107, 114, 128)", // slate-400 : gray-500
      },
    },
    label: {
      color: isDarkMode ? "rgb(248, 250, 252)" : "rgb(17, 24, 39)", // slate-50 : gray-900
    },
    button: {
      primary: {
        backgroundColor: isDarkMode ? "#f59e0b" : "#eab308", // yellow-500/600
        color: "#ffffff",
      },
      secondary: {
        backgroundColor: isDarkMode ? "rgb(51, 65, 85)" : "rgb(243, 244, 246)", // slate-700 : gray-100
        color: isDarkMode ? "rgb(248, 250, 252)" : "rgb(17, 24, 39)", // slate-50 : gray-900
        borderColor: isDarkMode ? "rgb(51, 65, 85)" : "rgb(209, 213, 219)", // slate-700 : gray-300
      },
    },
    section: {
      backgroundColor: isDarkMode ? "rgb(30, 41, 59)" : "rgb(255, 255, 255)", // slate-800 : white
      borderColor: isDarkMode ? "rgb(51, 65, 85)" : "rgb(209, 213, 219)", // slate-700 : gray-300
    },
  };

  const [form, setForm] = useState({
    name: "",
    versionName: "",
    summary: "",
    forWhichPost: "",
    suitableFor: [],
    tags: [],
    textContent: "",
    originalCreationDate: "",
    pdfFile: null,
    docxFile: null,
    videoFile: null,
    isActive: true,
  });
  const [fileLabels, setFileLabels] = useState({
    pdfFile: "",
    docxFile: "",
    videoFile: "",
  });
  const [uploadProgress, setUploadProgress] = useState({
    pdfFile: 0,
    docxFile: 0,
    videoFile: 0,
  });
  const [uploading, setUploading] = useState({
    pdfFile: false,
    docxFile: false,
    videoFile: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [themeKey, setThemeKey] = useState(0); // Force re-render on theme change

  // Force re-render when theme changes
  useEffect(() => {
    setThemeKey(prev => prev + 1);
  }, [isDarkMode]);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        versionName: initialData.versionName || "",
        summary: initialData.summary || "",
        forWhichPost: initialData.forWhichPost || "",
        suitableFor: initialData.suitableFor || [],
        tags: initialData.tags || [],
        textContent: initialData.textContent || "",
        originalCreationDate: initialData.originalCreationDate || "",
        pdfFile: null,
        docxFile: null,
        videoFile: null,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
      setFileLabels({
        pdfFile: initialData.pdfFile?.originalName || "",
        docxFile: initialData.docxFile?.originalName || "",
        videoFile: initialData.videoFile?.originalName || "",
      });
    } else {
      setForm({
        name: "",
        versionName: "",
        summary: "",
        forWhichPost: "",
        suitableFor: [],
        tags: [],
        textContent: "",
        originalCreationDate: "",
        pdfFile: null,
        docxFile: null,
        videoFile: null,
        isActive: true,
      });
      setFileLabels({
        pdfFile: "",
        docxFile: "",
        videoFile: "",
      });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (name === "suitableFor" || name === "tags") {
      setForm(f => ({ ...f, [name]: value.split(",").map(s => s.trim()) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleTextContentChange = content => {
    setForm(f => ({ ...f, textContent: content }));
  };

  const handleFileChange = (file, label, fileType) => {
    setForm(f => ({ ...f, [fileType]: file }));
    setFileLabels(prev => ({ ...prev, [fileType]: label }));
    setUploadProgress(prev => ({ ...prev, [fileType]: 0 }));
    setUploading(prev => ({ ...prev, [fileType]: false }));
  };

  const handleFileRemove = fileType => {
    setForm(f => ({ ...f, [fileType]: null }));
    setFileLabels(prev => ({ ...prev, [fileType]: "" }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Simulate upload progress for files
      const filesToUpload = ["pdfFile", "docxFile", "videoFile"].filter(type => form[type]);

      if (filesToUpload.length > 0) {
        // Start upload progress simulation
        filesToUpload.forEach(fileType => {
          setUploading(prev => ({ ...prev, [fileType]: true }));
        });

        // Simulate progress for each file
        for (const fileType of filesToUpload) {
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setUploadProgress(prev => ({ ...prev, [fileType]: progress }));
          }
        }
      }

      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
      // Reset upload states
      setUploading({
        pdfFile: false,
        docxFile: false,
        videoFile: false,
      });
      setUploadProgress({
        pdfFile: 0,
        docxFile: 0,
        videoFile: 0,
      });
    }
  };

  if (!open) return null;

  const fileUploadConfigs = [
    {
      fileType: "pdfFile",
      icon: FaFilePdf,
      colorClass: "text-red-500",
      bgColorClass: isDarkMode ? "bg-red-900/20" : "bg-green-50",
      borderColorClass: isDarkMode ? "border-red-700" : "border-green-200",
      textColorClass: isDarkMode ? "text-red-300" : "text-green-700",
      maxSize: 10 * 1024 * 1024,
      acceptedTypes: ["application/pdf"],
    },
    {
      fileType: "docxFile",
      icon: FaFileWord,
      colorClass: "text-blue-500",
      bgColorClass: isDarkMode ? "bg-blue-900/20" : "bg-blue-50",
      borderColorClass: isDarkMode ? "border-blue-700" : "border-blue-200",
      textColorClass: isDarkMode ? "text-blue-300" : "text-blue-700",
      maxSize: 5 * 1024 * 1024,
      acceptedTypes: [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ],
    },
    {
      fileType: "videoFile",
      icon: FaVideo,
      colorClass: "text-purple-500",
      bgColorClass: isDarkMode ? "bg-purple-900/20" : "bg-purple-50",
      borderColorClass: isDarkMode ? "border-purple-700" : "border-purple-200",
      textColorClass: isDarkMode ? "text-purple-300" : "text-purple-700",
      maxSize: 100 * 1024 * 1024,
      acceptedTypes: [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/webm",
      ],
      supportedFormats: "MP4, AVI, MOV, WMV, FLV, WebM",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        key={themeKey}
        className="rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
        style={themeStyles.modal}
      >
        <button
          className="absolute top-2 right-2 text-2xl hover:opacity-70 transition-opacity"
          style={{ color: currentTheme.text.secondary }}
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4" style={themeStyles.label}>
          {isEdit ? "Edit Resume" : "Add Resume"}
        </h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 rounded transition-colors"
              style={themeStyles.input}
              required
            />
            <input
              name="versionName"
              value={form.versionName}
              onChange={handleChange}
              placeholder="Version Name"
              className="w-full border p-2 rounded transition-colors"
              style={themeStyles.input}
              required
            />
          </div>
          <input
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="Summary"
            className="w-full border p-2 rounded transition-colors"
            style={themeStyles.input}
          />
          <input
            name="forWhichPost"
            value={form.forWhichPost}
            onChange={handleChange}
            placeholder="For Which Post"
            className="w-full border p-2 rounded transition-colors"
            style={themeStyles.input}
          />
          <input
            name="suitableFor"
            value={form.suitableFor.join(", ")}
            onChange={handleChange}
            placeholder="Suitable For (comma separated)"
            className="w-full border p-2 rounded transition-colors"
            style={themeStyles.input}
          />
          <input
            name="tags"
            value={form.tags.join(", ")}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border p-2 rounded transition-colors"
            style={themeStyles.input}
          />

          {/* TinyMCE Editor for Rich Text Content */}
          <div className="border p-3 rounded transition-colors" style={themeStyles.section}>
            <label className="block text-sm font-medium mb-2" style={themeStyles.label}>
              📝 Resume Content (Rich Text Editor):
            </label>
            <TinyMCEEditor
              value={form.textContent}
              onChange={handleTextContentChange}
              init={{
                height: 400,
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
                  "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height:1.6; }",
                placeholder:
                  "Write your resume content here... Use the toolbar to format text, add lists, links, etc.",
              }}
            />
          </div>

          <input
            name="originalCreationDate"
            type="date"
            value={form.originalCreationDate ? form.originalCreationDate.slice(0, 10) : ""}
            onChange={handleChange}
            className="w-full border p-2 rounded transition-colors"
            style={themeStyles.input}
          />

          {/* File Upload Section */}
          <div className="border p-3 rounded transition-colors" style={themeStyles.section}>
            <h3 className="font-semibold mb-2" style={themeStyles.label}>
              File Attachments
            </h3>
            <div className="space-y-4 ">
              {fileUploadConfigs.map(config => (
                <FileUpload
                  key={config.fileType}
                  fileType={config.fileType}
                  file={form[config.fileType]}
                  fileLabel={fileLabels[config.fileType]}
                  onFileChange={(file, label) => handleFileChange(file, label, config.fileType)}
                  onFileRemove={() => handleFileRemove(config.fileType)}
                  uploadProgress={uploadProgress[config.fileType]}
                  uploading={uploading[config.fileType]}
                  maxSize={config.maxSize}
                  acceptedTypes={config.acceptedTypes}
                  supportedFormats={config.supportedFormats}
                  icon={config.icon}
                  colorClass={config.colorClass}
                  bgColorClass={config.bgColorClass}
                  borderColorClass={config.borderColorClass}
                  textColorClass={config.textColorClass}
                />
              ))}
            </div>
          </div>

          <label className="inline-flex items-center" style={themeStyles.label}>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="mr-2"
            />{" "}
            Active
          </label>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded transition-colors hover:opacity-80"
              style={themeStyles.button.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded transition-colors disabled:opacity-50 hover:opacity-80"
              style={{
                ...themeStyles.button.primary,
                backgroundColor: isDarkMode ? "#f59e0b" : "#eab308", // yellow-500/600
                color: "#ffffff",
              }}
            >
              {submitting ? "Saving..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeFormModal;
