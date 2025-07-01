import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaSort } from "react-icons/fa";
import { myProjectWorksAPI } from "../../../services/apiService";

const MyProjectWorksList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: filterCategory,
        sortBy,
        sortOrder,
      };

      const response = await myProjectWorksAPI.getAllProjectWorks(params);
      console.log("API Response:", response); // Debug log

      // Handle different response structures
      let projectsData = [];
      let totalPagesData = 1;
      let totalItemsData = 0;

      if (response && typeof response === "object") {
        // If response is the data array directly
        if (Array.isArray(response)) {
          projectsData = response;
        }
        // If response has data property
        else if (response.data && Array.isArray(response.data)) {
          projectsData = response.data;
        }
        // If response has projects property
        else if (response.projects && Array.isArray(response.projects)) {
          projectsData = response.projects;
        }
        // If response is a single object, wrap it in array
        else if (response._id) {
          projectsData = [response];
        }

        totalPagesData = response.totalPages || response.total_pages || 1;
        totalItemsData =
          response.totalItems || response.total_items || response.total || projectsData.length;
      }

      console.log("Processed projects data:", projectsData); // Debug log
      setProjects(projectsData);
      setTotalPages(totalPagesData);
      setTotalItems(totalItemsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
      setProjects([]); // Set empty array on error
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, searchTerm, filterCategory, sortBy, sortOrder]);

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await myProjectWorksAPI.deleteProjectWork(id);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSort = field => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  // Add error state handling
  if (!Array.isArray(projects)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Project Works</h1>
            <p className="text-[var(--text-secondary)]">Manage your project works</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("create")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] text-white rounded-lg hover:from-[var(--primary-dark)] hover:to-[var(--primary-main)] transition-all duration-300 shadow-lg"
          >
            <FaPlus className="text-sm" />
            Add New Project
          </motion.button>
        </div>

        <div className="bg-[var(--background-paper)] p-8 rounded-lg border border-[var(--border-main)] text-center shadow-lg">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            API Connection Error
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Unable to connect to the backend API. Please check if the server is running.
          </p>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Project Works</h1>
          <p className="text-[var(--text-secondary)]">
            Manage your project works ({totalItems} total)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("create")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] text-white rounded-lg hover:from-[var(--primary-dark)] hover:to-[var(--primary-main)] transition-all duration-300 shadow-lg"
        >
          <FaPlus className="text-sm" />
          Add New Project
        </motion.button>
      </div>

      {/* Filters and Search */}
      <div className="bg-[var(--background-paper)] p-4 rounded-lg border border-[var(--border-main)]">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <FaSearch className="text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <FaFilter className="text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Filter by category..."
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <FaSort className="text-[var(--text-secondary)]" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full border border-[var(--border-main)] rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="w-28 border border-[var(--border-main)] rounded-lg px-3 py-2 bg-[var(--background-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-colors duration-200"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-[var(--background-paper)] rounded-lg border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--background-elevated)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Technology
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {!Array.isArray(projects) || projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    {!Array.isArray(projects) ? "Loading..." : "No projects found"}
                  </td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <motion.tr
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-[var(--background-elevated)] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">
                          {project.name}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {truncateText(project.overview, 80)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technology?.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technology?.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            +{project.technology.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`detail/${project._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <FaEye className="text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`edit/${project._id}`)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                          title="Edit Project"
                        >
                          <FaEdit className="text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(project._id)}
                          disabled={deleteLoading === project._id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                          title="Delete Project"
                        >
                          {deleteLoading === project._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                          ) : (
                            <FaTrash className="text-sm" />
                          )}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--background-elevated)] transition-colors duration-200"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-[var(--text-secondary)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--background-elevated)] transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjectWorksList;
