import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

/**
 * TinyMCEEditor - A reusable TinyMCE editor component
 * @param {string} value - The HTML content
 * @param {function} onChange - Callback when content changes
 * @param {function} onInit - Callback when editor is initialized
 * @param {object} init - TinyMCE init config (optional, will merge with defaults)
 * @param {string} apiKey - TinyMCE API key (optional, default provided)
 * @param {object} editorProps - Any other props to pass to Editor
 */
const TinyMCEEditor = ({
  value = "",
  onChange,
  onInit,
  init = {},
  apiKey = "dlfn3zegy6zpe1fznqli3y0i6rkf4mlhpntqfq5vcqetdl5v",
  ...editorProps
}) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Default config
  const defaultInit = {
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
    paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,br,ul,ol,li,a[href],span",
    paste_retain_style_properties: "all",
    paste_strip_class_attributes: false,
    paste_remove_styles: false,
    paste_remove_styles_if_webkit: false,
    paste_preprocess: function (plugin, args) {
      // Optionally handle paste preprocess
    },
    paste_postprocess: function (plugin, args) {
      // Optionally handle paste postprocess
    },
  };

  // Merge default and custom init
  const mergedInit = { ...defaultInit, ...init };

  useEffect(() => {
    if (isEditorReady && editorRef.current && value !== undefined) {
      // Keep editor content in sync with value prop
      if (editorRef.current.getContent() !== value) {
        editorRef.current.setContent(value);
      }
    }
  }, [value, isEditorReady]);

  return (
    <Editor
      {...editorProps}
      apiKey={apiKey}
      value={value}
      onInit={(evt, editor) => {
        editorRef.current = editor;
        setIsEditorReady(true);
        if (onInit) onInit(evt, editor);
        // Set initial content if value is provided
        if (value && value.trim()) {
          editor.setContent(value);
        }
      }}
      onEditorChange={content => {
        if (onChange) onChange(content);
      }}
      init={mergedInit}
    />
  );
};

export default TinyMCEEditor;
