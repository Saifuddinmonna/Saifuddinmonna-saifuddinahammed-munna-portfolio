import React from "react";
import "./ResumeLayout.css";

const ResumeLayout = ({ children }) => {
  return (
    <div className="resume-container">
      <div className="resume-content">{children}</div>
    </div>
  );
};

export default ResumeLayout;
