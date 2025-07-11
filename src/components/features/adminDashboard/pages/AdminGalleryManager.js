import React from "react";

const AdminGalleryManager = () => {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        borderRadius: "16px",
        margin: "2rem auto",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        maxWidth: 700,
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: 800,
          color: "#6366f1",
          marginBottom: "1rem",
          letterSpacing: 2,
          textAlign: "center",
        }}
      >
        🚧 Coming Soon 🚧
      </h1>
      <p style={{ fontSize: "1.5rem", color: "#374151", textAlign: "center" }}>
        The Admin Gallery feature is under construction.
        <br />
        Please check back later!
      </p>
    </div>
  );
};

export default AdminGalleryManager;
