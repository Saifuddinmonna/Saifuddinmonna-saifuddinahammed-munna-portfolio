import React, { useState, useEffect } from "react";

const LoadingSpinner = ({
  message = "Loading...",
  timeout = 10000,
  showTimeoutMessage = true,
  size = "large",
}) => {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, timeout);

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1000);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [timeout]);

  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-16 w-16",
    large: "h-32 w-32",
  };

  const formatTime = ms => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      {/* Main Spinner */}
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 dark:border-blue-400 ${sizeClasses[size]} mb-4`}
      ></div>

      {/* Loading Message */}
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{message}</p>

      {/* Elapsed Time */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{formatTime(elapsedTime)}</p>

      {/* Timeout Warning */}
      {showTimeoutWarning && showTimeoutMessage && (
        <div className="max-w-md mx-auto p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Taking longer than expected
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This might be due to a slow connection or server response. Please wait or try
                refreshing the page.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Network Status */}
      <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        {navigator.onLine ? (
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Online
          </span>
        ) : (
          <span className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Offline
          </span>
        )}
      </div>
    </div>
  );
};

// Compact version for smaller loading states
export const CompactSpinner = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 dark:border-blue-400 ${sizeClasses[size]} mr-3`}
      ></div>
      <span className="text-sm text-gray-600 dark:text-gray-300">{message}</span>
    </div>
  );
};

// Inline spinner for buttons and small components
export const InlineSpinner = ({ size = "small" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-current ${sizeClasses[size]}`}
    ></div>
  );
};

export default LoadingSpinner;
