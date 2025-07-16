import React from "react";
import "./ResumeLayout.css";

const ResumeLayout = ({ children }) => {
  return (
    <div className="resume-container resume-layout-root">
      <div className="resume-content">{children}</div>
    </div>
  );
};

export default ResumeLayout;
