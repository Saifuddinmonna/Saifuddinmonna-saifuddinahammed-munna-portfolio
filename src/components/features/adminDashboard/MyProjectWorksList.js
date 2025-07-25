import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { myProjectWorksAPI } from "../../../services/apiService";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaArrowLeft,
  FaThLarge,
  FaList,
  FaTable,
} from "react-icons/fa";
import { useDataFetching } from "../../../hooks/useDataFetching";
import { useIsAdmin } from "../../../utils/adminUtils";

// Skeleton Loading Component
const ProjectSkeleton = () => (
  <div className="bg-[var(--background-paper)] border border-[var(--border-main)] rounded-lg p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-6 bg-[var(--background-elevated)] rounded w-1/3"></div>
      <div className="h-4 bg-[var(--background-elevated)] rounded w-16"></div>
    </div>
    <div className="h-4 bg-[var(--background-elevated)] rounded w-full mb-2"></div>
    <div className="h-4 bg-[var(--background-elevated)] rounded w-3/4 mb-3"></div>
    <div className="flex flex-wrap gap-2 mb-3">
      <div className="h-6 bg-[var(--background-elevated)] rounded w-20"></div>
      <div className="h-6 bg-[var(--background-elevated)] rounded w-24"></div>
      <div className="h-6 bg-[var(--background-elevated)] rounded w-16"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-8 bg-[var(--background-elevated)] rounded w-16"></div>
      <div className="h-8 bg-[var(--background-elevated)] rounded w-16"></div>
    </div>
  </div>
);

// Pagination utility
const getPageNumbers = (total, perPage) => {
  const totalPages = Math.ceil(total / perPage);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

const MyProjectWorksList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 20;
  const isAdmin = useIsAdmin();
  // View mode state
  const [viewMode, setViewMode] = useState("card"); // 'card' | 'list' | 'table'

  // Use the new custom hook for better data handling
  const {
    data: projectsData,
    isLoading: loading,
    error,
    refetch: fetchProjects,
  } = useDataFetching(["my-project-works"], () => myProjectWorksAPI.getAllProjectWorks(), {
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 2,
  });

  console.log("📊 [MyProjectWorks] Raw data received:", projectsData);
  console.log("📊 [MyProjectWorks] Data type:", typeof projectsData);
  console.log("📊 [MyProjectWorks] Is array:", Array.isArray(projectsData));

  // Process projects data with proper extraction
  useEffect(() => {
    let processedProjects = [];

    if (projectsData) {
      // The useDataFetching hook should already handle the data extraction
      // So we can directly use the data
      if (Array.isArray(projectsData)) {
        processedProjects = projectsData;
      } else if (projectsData && typeof projectsData === "object") {
        // Fallback: if data is still an object, try to find array properties
        if (projectsData.data && Array.isArray(projectsData.data)) {
          processedProjects = projectsData.data;
        } else if (projectsData.works && Array.isArray(projectsData.works)) {
          processedProjects = projectsData.works;
        } else if (projectsData.projects && Array.isArray(projectsData.projects)) {
          processedProjects = projectsData.projects;
        } else {
          // Last resort: find any array in the object
          const possibleArrays = Object.values(projectsData).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            processedProjects = possibleArrays[0];
          }
        }
      }
    }

    console.log("📊 [MyProjectWorks] Final processed projects:", processedProjects);
    setProjects(processedProjects);
    setFilteredProjects(processedProjects);
    setInitialLoading(false);
  }, [projectsData]);

  // Search and filter functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      setCurrentPage(1);
      return;
    }

    const filtered = projects.filter(
      project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technology?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [searchTerm, projects]);

  // Category filter
  useEffect(() => {
    if (!filterCategory) {
      setFilteredProjects(projects);
      setCurrentPage(1);
      return;
    }
    const filtered = projects.filter(p => p.category === filterCategory);
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [filterCategory, projects]);

  // Delete project with loading state
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      setDeleteLoading(id);
      await myProjectWorksAPI.deleteProjectWork(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      setFilteredProjects(prev => prev.filter(p => p._id !== id));
      toast.success("Project deleted successfully");
    } catch (err) {
      console.error("❌ [List] Error deleting project:", err);
      toast.error("Failed to delete project");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Loading skeleton array
  const skeletonArray = Array.from({ length: 6 }, (_, i) => i);

  // Debug panel for development
  const DebugPanel = () => {
    if (process.env.NODE_ENV !== "development") return null;

    return (
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Debug Info:</h4>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <div>Loading: {loading ? "Yes" : "No"}</div>
          <div>Initial Loading: {initialLoading ? "Yes" : "No"}</div>
          <div>Error: {error || "None"}</div>
          <div>Raw Data Type: {typeof projectsData}</div>
          <div>Raw Data Keys: {projectsData ? Object.keys(projectsData).join(", ") : "None"}</div>
          <div>Processed Projects Count: {projects.length}</div>
          <div>Filtered Projects Count: {filteredProjects.length}</div>
          <div>Search Term: "{searchTerm}"</div>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <div className="h-8 bg-[var(--background-elevated)] rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="h-10 bg-[var(--background-elevated)] rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonArray.map(i => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-200"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Project Works</h1>
          </div>
          <Link
            to="create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors duration-200"
          >
            <FaPlus />
            Add New Project
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            >
              <option value="">All Categories</option>
              {Array.from(new Set(projects?.map(p => p.category) || [])).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* View Mode Switcher */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded border ${
                viewMode === "card"
                  ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                  : "border-[var(--border-main)] bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
              }`}
              title="Card/Grid View"
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded border ${
                viewMode === "list"
                  ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                  : "border-[var(--border-main)] bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
              }`}
              title="List View"
            >
              <FaList />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded border ${
                viewMode === "table"
                  ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                  : "border-[var(--border-main)] bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
              }`}
              title="Table View"
            >
              <FaTable />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--background-paper)] border border-[var(--border-main)] rounded-lg p-4">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {projects?.length || 0}
            </div>
            <div className="text-[var(--text-secondary)] text-sm">Total Projects</div>
          </div>
          <div className="bg-[var(--background-paper)] border border-[var(--border-main)] rounded-lg p-4">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {filteredProjects.length}
            </div>
            <div className="text-[var(--text-secondary)] text-sm">Filtered Projects</div>
          </div>
          <div className="bg-[var(--background-paper)] border border-[var(--border-main)] rounded-lg p-4">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {Array.from(new Set(projects?.map(p => p.category) || [])).length}
            </div>
            <div className="text-[var(--text-secondary)] text-sm">Categories</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchProjects}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonArray.map(i => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Projects Grid */}
      <>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-[var(--text-secondary)]">📁</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first project"}
            </p>
            {!searchTerm && (
              <Link
                to="create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-main)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors duration-200"
              >
                <FaPlus />
                Create First Project
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Card/Grid View */}
            {viewMode === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects
                  .slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)
                  .map((project, index) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[var(--background-paper)] border border-[var(--border-main)] rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:border-[var(--primary-main)]"
                    >
                      {/* Project Images */}
                      {project.images && project.images.length > 0 && (
                        <div className="mb-3 relative">
                          <img
                            src={
                              project.images[0].thumbnailUrl ||
                              project.images[0].fullImageUrl ||
                              project.images[0].url
                            }
                            alt={project.name}
                            className="w-full h-32 object-cover rounded-lg"
                            loading="lazy"
                          />
                          {project.images.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              +{project.images.length - 1}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Project Info */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-[var(--text-primary)] text-lg truncate">
                          {project.name}
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs bg-[var(--primary-main)] text-white px-2 py-1 rounded">
                            {project.category}
                          </span>
                          {project.categoryType && (
                            <span className="text-xs bg-[var(--background-elevated)] text-[var(--text-secondary)] px-2 py-1 rounded">
                              {project.categoryType === "predefined" ? "Predefined" : "Custom"}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-2">
                        {project.overview}
                      </p>
                      {/* Technologies */}
                      {project.technology && project.technology.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technology.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-[var(--background-elevated)] text-[var(--text-secondary)] px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technology.length > 3 && (
                            <span className="text-xs text-[var(--text-secondary)]">
                              +{project.technology.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          to={`detail/${project._id}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--primary-main)] text-white rounded text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors duration-200"
                          title="View"
                        >
                          <FaEye className="text-xs" />
                        </Link>
                        <Link
                          to={`edit/${project._id}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] rounded text-sm font-medium hover:bg-[var(--background-default)] transition-colors duration-200"
                          title="Edit"
                        >
                          <FaEdit className="text-xs" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
                          disabled={deleteLoading === project._id}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === project._id ? (
                            <FaSpinner className="text-xs animate-spin" />
                          ) : (
                            <FaTrash className="text-xs" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
            {/* List View */}
            {viewMode === "list" && (
              <div className="divide-y divide-[var(--border-main)] bg-[var(--background-paper)] rounded-lg overflow-hidden">
                {filteredProjects
                  .slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)
                  .map((project, index) => (
                    <div
                      key={project._id}
                      className="flex flex-col md:flex-row items-center md:items-stretch gap-4 p-4"
                    >
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                        <div className="font-bold text-[var(--text-primary)] text-lg md:w-1/4 truncate">
                          {project.name}
                        </div>
                        <div className="text-xs bg-[var(--primary-main)] text-white px-2 py-1 rounded md:w-1/6 text-center">
                          {project.category}
                        </div>
                        <div className="text-[var(--text-secondary)] text-sm md:w-1/2 line-clamp-2">
                          {project.overview}
                        </div>
                        <div className="flex flex-wrap gap-1 md:w-1/4">
                          {project.technology &&
                            project.technology.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-[var(--background-elevated)] text-[var(--text-secondary)] px-2 py-1 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          {project.technology && project.technology.length > 3 && (
                            <span className="text-xs text-[var(--text-secondary)]">
                              +{project.technology.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 md:items-center md:justify-end">
                        <Link
                          to={`detail/${project._id}`}
                          className="p-2 rounded bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`edit/${project._id}`}
                          className="p-2 rounded bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] hover:bg-[var(--background-default)]"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
                          disabled={deleteLoading === project._id}
                          className="p-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === project._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {/* Table View */}
            {viewMode === "table" && (
              <div className="overflow-x-auto bg-[var(--background-paper)] rounded-lg">
                <table className="min-w-full table-auto border border-[var(--border-main)]">
                  <thead>
                    <tr className="bg-[var(--background-elevated)]">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)] border-b border-[var(--border-main)]">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)] border-b border-[var(--border-main)]">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)] border-b border-[var(--border-main)]">
                        Overview
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text-primary)] border-b border-[var(--border-main)]">
                        Tech
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-[var(--text-primary)] border-b border-[var(--border-main)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects
                      .slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)
                      .map(project => (
                        <tr
                          key={project._id}
                          className="border-b border-[var(--border-main)] hover:bg-[var(--background-elevated)]"
                        >
                          <td className="px-4 py-2 font-bold text-[var(--text-primary)] truncate max-w-[180px]">
                            {project.name}
                          </td>
                          <td className="px-4 py-2">
                            <span className="text-xs bg-[var(--primary-main)] text-white px-2 py-1 rounded">
                              {project.category}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-[var(--text-secondary)] text-sm line-clamp-2 max-w-[300px]">
                            {project.overview}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap gap-1">
                              {project.technology &&
                                project.technology.slice(0, 3).map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-[var(--background-elevated)] text-[var(--text-secondary)] px-2 py-1 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              {project.technology && project.technology.length > 3 && (
                                <span className="text-xs text-[var(--text-secondary)]">
                                  +{project.technology.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex gap-2 justify-center">
                              <Link
                                to={`detail/${project._id}`}
                                className="p-2 rounded bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
                                title="View"
                              >
                                <FaEye />
                              </Link>
                              <Link
                                to={`edit/${project._id}`}
                                className="p-2 rounded bg-[var(--background-elevated)] text-[var(--text-primary)] border border-[var(--border-main)] hover:bg-[var(--background-default)]"
                                title="Edit"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(project._id)}
                                disabled={deleteLoading === project._id}
                                className="p-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                title="Delete"
                              >
                                {deleteLoading === project._id ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaTrash />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination Bar */}
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded border border-[var(--border-main)] bg-[var(--background-paper)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {getPageNumbers(filteredProjects.length, projectsPerPage).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded border ${
                    page === currentPage
                      ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                      : "border-[var(--border-main)] bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(p =>
                    Math.min(getPageNumbers(filteredProjects.length, projectsPerPage).length, p + 1)
                  )
                }
                disabled={
                  currentPage === getPageNumbers(filteredProjects.length, projectsPerPage).length
                }
                className="px-3 py-2 rounded border border-[var(--border-main)] bg-[var(--background-paper)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </>

      {isAdmin && <DebugPanel />}
    </div>
  );
};

export default MyProjectWorksList;
