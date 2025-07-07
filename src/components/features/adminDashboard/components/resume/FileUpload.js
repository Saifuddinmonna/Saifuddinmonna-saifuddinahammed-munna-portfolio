import React from "react";

const FileUpload = ({
  fileType,
  file,
  fileLabel,
  onFileChange,
  onFileRemove,
  uploadProgress = 0,
  uploading = false,
  maxSize,
  acceptedTypes,
  supportedFormats,
  icon: Icon,
  colorClass,
  bgColorClass,
  borderColorClass,
  textColorClass,
}) => {
  const formatFileSize = bytes => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // File validation
    if (selectedFile.size > maxSize) {
      const sizeMB = Math.round(maxSize / (1024 * 1024));
      alert(`File too large. Maximum size is ${sizeMB}MB`);
      e.target.value = "";
      return;
    }

    if (!acceptedTypes.includes(selectedFile.type)) {
      alert(`Invalid file type. Please select a valid ${fileType.replace("File", "")} file.`);
      e.target.value = "";
      return;
    }

    // For video files, show additional info
    if (fileType === "videoFile") {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const duration = Math.round(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        onFileChange(
          selectedFile,
          `${selectedFile.name} (${minutes}:${seconds.toString().padStart(2, "0")})`
        );
      };

      video.src = URL.createObjectURL(selectedFile);
    } else {
      onFileChange(selectedFile, selectedFile.name);
    }
  };

  return (
    <div
      className={`border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 hover:border-gray-400 dark:hover:border-slate-500 transition-colors bg-white dark:bg-slate-700`}
    >
      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-50">
        <Icon className={`inline mr-1 ${colorClass}`} />
        {fileType.replace("File", "").toUpperCase()} File (Max:{" "}
        {Math.round(maxSize / (1024 * 1024))}MB)
      </label>

      {supportedFormats && (
        <div className="text-xs text-gray-600 dark:text-slate-400 mb-2">
          Supported formats: {supportedFormats}
        </div>
      )}

      <input
        type="file"
        accept={acceptedTypes.map(type => `.${type.split("/")[1]}`).join(",")}
        onChange={handleFileChange}
        className="block w-full text-sm border border-gray-300 dark:border-slate-600 rounded p-2 bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 dark:file:bg-yellow-900 file:text-yellow-700 dark:file:text-yellow-300 hover:file:bg-yellow-100 dark:hover:file:bg-yellow-800"
      />

      {fileLabel && (
        <div className={`mt-2 p-2 ${bgColorClass} border ${borderColorClass} rounded`}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-sm ${textColorClass}`}>{fileLabel}</span>
              {file && (
                <div className="text-xs text-gray-500 dark:text-slate-400">
                  {formatFileSize(file.size)}
                </div>
              )}
            </div>
            <button
              onClick={onFileRemove}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ✕
            </button>
          </div>
          {uploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className={`${colorClass.replace(
                    "text-",
                    "bg-"
                  )} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                Uploading... {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
