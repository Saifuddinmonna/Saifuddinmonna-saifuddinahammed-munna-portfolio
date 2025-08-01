import React from "react";
import "./VideoResume.css";

const VideoResume = () => {
  return (
    <div className="video-resume-container">
      <div className="video-wrapper">
        <iframe
          className="video-frame"
          src="https://www.youtube.com/embed/your-video-id"
          title="Video Resume"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="video-description resume-video-description">
        <h2 className="resume-video-title">My Video Resume</h2>
        <p className="resume-video-text">
          Watch my video resume to learn more about my skills and experience.
        </p>
      </div>
    </div>
  );
};

export default VideoResume;
