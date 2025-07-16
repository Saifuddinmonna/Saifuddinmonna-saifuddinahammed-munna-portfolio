import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

// Error Boundary Component for React Errors
export const ErrorBoundary = ({ children }) => {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>;
};

// Error Fallback Component for Route Errors
export function ErrorFallback({ error }) {
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);
  const errorToDisplay = isRouteError ? routeError : error;

  // Handle chunk loading errors specifically
  const isChunkError =
    errorToDisplay?.message?.includes("Loading chunk") ||
    errorToDisplay?.message?.includes("missing:") ||
    errorToDisplay?.name === "ChunkLoadError";

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isChunkError ? "Page Loading Error" : "Something went wrong"}
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {isChunkError
            ? "The page failed to load properly. This might be due to a network issue or cached files."
            : "We encountered an unexpected error. Please try again or contact support if the problem persists."}
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && errorToDisplay && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2">
              Error Details (Development)
            </summary>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
              <pre>{errorToDisplay.message || errorToDisplay.toString()}</pre>
              {errorToDisplay.stack && <pre className="mt-2">{errorToDisplay.stack}</pre>}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex-1 sm:flex-none"
          >
            <svg
              className="inline w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>

          <Link
            to="/"
            onClick={handleGoHome}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex-1 sm:flex-none text-center"
          >
            <svg
              className="inline w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            If the problem persists, try clearing your browser cache or contact support.
          </p>
          <Link
            to="/cache-clear.html"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear Browser Cache
          </Link>
        </div>
      </div>
    </div>
  );
}

// Specific Error Page for 404 Not Found
export function NotFoundError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        {/* 404 Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-6">
          <svg
            className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex-1 sm:flex-none text-center"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex-1 sm:flex-none"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
