import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { myProjectWorksAPI } from "../../../services/apiService";
import { motion } from "framer-motion";
import { FaArrowLeft, FaEdit, FaTrash, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import MarkdownEditor from "../../ui/MarkdownEditor";

// Skeleton Loading Components
const DetailSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="mb-6">
      <div className="h-8 bg-[var(--background-elevated)] rounded w-1/4 mb-4 animate-pulse"></div>
      <div className="h-6 bg-[var(--background-elevated)] rounded w-1/3 animate-pulse"></div>
    </div>
    <div className="bg-[var(--background-paper)] border border-[var(--border-main)] rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="h-64 bg-[var(--background-elevated)] rounded-lg mb-4 animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 bg-[var(--background-elevated)] rounded w-full"></div>
            <div className="h-4 bg-[var(--background-elevated)] rounded w-3/4"></div>
            <div className="h-4 bg-[var(--background-elevated)] rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-[var(--background-elevated)] rounded w-1/2"></div>
          <div className="h-4 bg-[var(--background-elevated)] rounded w-full"></div>
          <div className="h-4 bg-[var(--background-elevated)] rounded w-3/4"></div>
          <div className="h-4 bg-[var(--background-elevated)] rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

const MyProjectWorksDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showMdPreview, setShowMdPreview] = useState({});

  // Fetch project details
  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 [Detail] Fetching project details...");

      const response = await myProjectWorksAPI.getProjectWork(id);
      console.log("✅ [Detail] Raw API response:", response);

      // Extract actual project data from nested response
      let projectData = response;
      if (response && response.data) {
        projectData = response.data;
        console.log("✅ [Detail] Extracted from response.data:", projectData);
      } else if (response && response.success && response.data) {
        projectData = response.data;
        console.log("✅ [Detail] Extracted from success wrapper:", projectData);
      }

      console.log("📋 [Detail] Final project data:", projectData);
      setProject(projectData);

      // Initialize preview states for markdown docs
      const previewStates = {};
      (projectData?.mdDocumentation || []).forEach((doc, idx) => {
        previewStates[idx] = false;
      });
      setShowMdPreview(previewStates);
    } catch (err) {
      console.error("❌ [Detail] Error fetching project:", err);
      setError(err?.response?.data?.message || "Failed to load project details");
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete this project? This action cannot be undone.")
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      await myProjectWorksAPI.deleteProjectWork(id);
      toast.success("Project deleted successfully");
      // Navigate back to list
      window.history.back();
    } catch (err) {
      console.error("❌ [Detail] Error deleting project:", err);
      toast.error("Failed to delete project");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle markdown preview
  const toggleMdPreview = idx => {
    setShowMdPreview(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Format date
  const formatDate = dateString => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (initialLoading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link
            to="/admin/dashboard/myprojectworks"
            className="inline-flex items-center gap-2 text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-200 mb-4"
          >
            <FaArrowLeft />
            Back to Projects
          </Link>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Error Loading Project
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">{error}</p>
          <button
            onClick={fetchProject}
            className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link
            to="/admin/dashboard/myprojectworks"
            className="inline-flex items-center gap-2 text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-200 mb-4"
          >
            <FaArrowLeft />
            Back to Projects
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 text-[var(--text-secondary)]">❓</div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Project Not Found
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/admin/dashboard/myprojectworks"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-main)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors duration-200"
          >
            <FaArrowLeft />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/dashboard/myprojectworks"
          className="inline-flex items-center gap-2 text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-200 mb-4"
        >
          <FaArrowLeft />
          Back to Projects
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{project.name}</h1>
            <p className="text-[var(--text-secondary)]">
              Created on {formatDate(project.createdAt)}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/admin/dashboard/myprojectworks/edit/${id}`}
              onClick={() => {
                console.log("🔄 [Detail] Edit button clicked");
                console.log("🔄 [Detail] Project ID:", id);
                console.log(
                  "🔄 [Detail] Navigate to:",
                  `/admin/dashboard/myprojectworks/edit/${id}`
                );
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors duration-200"
            >
              <FaEdit />
              Edit Project
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
            >
              {deleteLoading ? <FaSpinner className="animate-spin" /> : <FaTrash />}
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <DetailSkeleton />}

      {/* Project Content */}
      {!loading && project && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[var(--background-paper)] border border-[var(--border-main)] rounded-lg p-6 shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images and Basic Info */}
            <div>
              {/* Project Images */}
              {project.images && project.images.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                    Screenshots ({project.images.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {project.images.map((img, idx) => (
                      <div key={img._id || idx} className="relative group">
                        <img
                          src={img.fullImageUrl || img.thumbnailUrl || img.url}
                          alt={`${project.name} screenshot ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-[var(--border-main)] hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => window.open(img.fullImageUrl || img.url, "_blank")}
                            className="opacity-0 group-hover:opacity-100 bg-white/90 text-black p-2 rounded-full transition-opacity duration-200"
                            title="View full size"
                          >
                            <FaEye className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-8 text-center border-2 border-dashed border-[var(--border-main)] rounded-lg">
                  <div className="text-4xl mb-2 text-[var(--text-secondary)]">📷</div>
                  <p className="text-[var(--text-secondary)]">No screenshots available</p>
                </div>
              )}

              {/* Project Overview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Overview</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{project.overview}</p>
              </div>

              {/* Technologies */}
              {project.technology && project.technology.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technology.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[var(--primary-main)] text-white text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details and Links */}
            <div>
              {/* Category */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Category</h3>
                <div className="flex flex-col gap-2">
                  <span className="inline-block px-3 py-1 bg-[var(--primary-main)] text-white rounded-lg font-medium">
                    {project.category}
                  </span>
                  {project.categoryType && (
                    <span className="inline-block px-3 py-1 bg-[var(--background-elevated)] text-[var(--text-secondary)] rounded-lg border border-[var(--border-main)] text-sm">
                      Type:{" "}
                      {project.categoryType === "predefined"
                        ? "Predefined Category"
                        : "Custom Category"}
                    </span>
                  )}
                </div>
              </div>

              {/* Live Links */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                  Live Links
                </h3>
                <div className="space-y-3">
                  {project.liveWebsite && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                        Live Website
                      </label>
                      <a
                        href={project.liveWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] underline break-all"
                      >
                        {project.liveWebsite}
                      </a>
                    </div>
                  )}
                  {project.liveWebsiteRepo && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                        Frontend Repository
                      </label>
                      <a
                        href={project.liveWebsiteRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] underline break-all"
                      >
                        {project.liveWebsiteRepo}
                      </a>
                    </div>
                  )}
                  {project.liveServersite && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                        Backend API
                      </label>
                      <a
                        href={project.liveServersite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] underline break-all"
                      >
                        {project.liveServersite}
                      </a>
                    </div>
                  )}
                  {project.liveServersiteRepo && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                        Backend Repository
                      </label>
                      <a
                        href={project.liveServersiteRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] underline break-all"
                      >
                        {project.liveServersiteRepo}
                      </a>
                    </div>
                  )}
                  {!project.liveWebsite &&
                    !project.liveWebsiteRepo &&
                    !project.liveServersite &&
                    !project.liveServersiteRepo && (
                      <p className="text-[var(--text-secondary)] italic">No live links available</p>
                    )}
                </div>
              </div>

              {/* Rich Text Documentation */}
              {project.documentation && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                    Documentation
                  </h3>
                  <div
                    className="prose prose-sm max-w-none text-[var(--text-primary)]"
                    dangerouslySetInnerHTML={{ __html: project.documentation }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Markdown Documentation */}
          {project.mdDocumentation && project.mdDocumentation.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--border-main)]">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                Markdown Documentation ({project.mdDocumentation.length})
              </h3>
              <div className="space-y-6">
                {project.mdDocumentation.map((doc, idx) => (
                  <div
                    key={doc._id || idx}
                    className="border border-[var(--border-main)] rounded-lg p-4 bg-[var(--background-elevated)]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-[var(--text-primary)]">
                        {doc.title}
                      </h4>
                      <button
                        onClick={() => toggleMdPreview(idx)}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        title={showMdPreview[idx] ? "Hide Preview" : "Show Preview"}
                      >
                        {showMdPreview[idx] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {doc.slug && (
                      <p className="text-sm text-[var(--text-secondary)] mb-3">Slug: {doc.slug}</p>
                    )}
                    {showMdPreview[idx] && (
                      <div className="border border-[var(--border-main)] rounded-lg overflow-hidden">
                        <MarkdownEditor value={doc.content} readOnly />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MyProjectWorksDetail;
