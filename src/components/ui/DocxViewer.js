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

  if (loading)
    return (
      <div className={`${className} flex items-center justify-center h-full`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Loading DOCX...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className={`${className} flex items-center justify-center h-full text-red-500`}>
        <div className="text-center">
          <p>Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div
      className={`docx-viewer ${className}`}
      style={{
        height: "100%",
        overflow: "auto",
        padding: "20px",
        backgroundColor: "white",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "1.6",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default DocxViewer;
