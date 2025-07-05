import React, { useEffect, useState } from "react";
import mammoth from "mammoth";

const DocxViewer = ({ url, className = "" }) => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setHtml("");
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch docx file");
        return res.arrayBuffer();
      })
      .then(arrayBuffer =>
        mammoth.convertToHtml({ arrayBuffer }).then(result => {
          setHtml(result.value);
          setLoading(false);
        })
      )
      .catch(err => {
        setError(err.message || "Failed to load docx");
        setLoading(false);
      });
  }, [url]);

  if (!url) return <div className={className}>No file provided.</div>;
  if (loading) return <div className={className}>Loading DOCX...</div>;
  if (error) return <div className={className + " text-red-500"}>{error}</div>;
  return (
    <div
      className={className + " docx-viewer bg-white p-4 rounded shadow overflow-auto"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default DocxViewer;
