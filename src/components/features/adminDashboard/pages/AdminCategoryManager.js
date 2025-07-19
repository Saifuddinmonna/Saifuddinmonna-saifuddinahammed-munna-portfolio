import React, { useState, useMemo, useEffect } from "react";
import { blogCategoryAPI } from "../../../../services/apiService";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaSitemap, FaListUl } from "react-icons/fa";

// CategoryForm with dropdown for parent selection
const CategoryForm = ({ initial, onSubmit, onCancel, allCategories }) => {
  const [name, setName] = useState(initial?.name || "");
  const [parent, setParent] = useState(initial?.parent || "");
  useEffect(() => {
    setName(initial?.name || "");
    setParent(initial?.parent || "");
  }, [initial]);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ name, parent: parent || null });
      }}
      className="flex flex-col gap-2 mb-4"
    >
      <input
        className="border rounded px-2 py-1"
        placeholder="Category name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <select
        className="border rounded px-2 py-1"
        value={parent}
        onChange={e => setParent(e.target.value)}
      >
        <option value="">No parent (root)</option>
        {allCategories
          .filter(cat => !initial || cat._id !== initial._id) // prevent self-parenting
          .map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
          Save
        </button>
        <button type="button" className="bg-gray-300 px-3 py-1 rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const CategoryTree = ({ nodes, onEdit, onDelete }) => (
  <ul className="ml-4 border-l pl-2">
    {nodes.map(cat => (
      <li key={cat._id} className="mb-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{cat.name}</span>
          <span className="text-xs text-gray-500">({cat.children?.length || 0} children)</span>
          <button
            className="ml-2 text-xs text-blue-600 hover:text-blue-800"
            onClick={() => onEdit(cat)}
          >
            Edit
          </button>
          <button
            className="ml-2 text-xs text-red-600 hover:text-red-800"
            onClick={() => onDelete(cat._id)}
          >
            Delete
          </button>
        </div>
        {cat.children && cat.children.length > 0 && (
          <CategoryTree nodes={cat.children} onEdit={onEdit} onDelete={onDelete} />
        )}
      </li>
    ))}
  </ul>
);

const AdminCategoryManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [view, setView] = useState("flat"); // or "tree"
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories for display (flat or tree)
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (view === "tree") {
        data = await blogCategoryAPI.getCategoryTree();
      } else {
        data = await blogCategoryAPI.getAllCategories();
      }
      setCategories(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories (flat) for parent dropdown
  const fetchAllCategories = async () => {
    try {
      const data = await blogCategoryAPI.getAllCategories();
      setAllCategories(data || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAllCategories();
    // eslint-disable-next-line
  }, [view]);

  // Helper to get category name by id
  const getCategoryNameById = useMemo(() => {
    const map = {};
    allCategories.forEach(cat => {
      map[cat._id] = cat.name;
    });
    return id => map[id] || "-";
  }, [allCategories]);

  // CRUD handlers
  const handleAdd = () => {
    setEditCategory(null);
    setShowForm(true);
  };
  const handleEdit = cat => {
    setEditCategory(cat);
    setShowForm(true);
  };
  const handleDelete = async id => {
    if (window.confirm("Delete this category?")) {
      setLoading(true);
      try {
        await blogCategoryAPI.deleteCategory(id);
        toast.success("Category deleted");
        fetchCategories();
        fetchAllCategories();
      } catch (err) {
        toast.error(err?.response?.data?.error || "Delete failed");
      } finally {
        setLoading(false);
      }
    }
  };
  const handleFormSubmit = async data => {
    setLoading(true);
    try {
      if (editCategory) {
        await blogCategoryAPI.updateCategory(editCategory._id, data);
        toast.success("Category updated");
      } else {
        await blogCategoryAPI.createCategory(data);
        toast.success("Category created");
      }
      setShowForm(false);
      setEditCategory(null);
      fetchCategories();
      fetchAllCategories();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[var(--background-paper)] dark:bg-[var(--background-paper)] min-h-screen">
      <div className="flex flex-row flex-wrap items-center gap-4 mb-4 sm:flex-col sm:items-stretch sm:gap-2">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Blog Category Manager</h1>
        <button
          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded w-auto sm:w-full"
          onClick={handleAdd}
        >
          <FaPlus /> Add Category
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded border transition-colors duration-200 w-auto sm:w-full ${
            view === "flat"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-[var(--background-default)] text-[var(--text-primary)] border-[var(--border-main)] dark:bg-gray-800 dark:text-[var(--text-primary)] dark:border-gray-700"
          }`}
          onClick={() => setView("flat")}
        >
          <FaListUl /> Flat View
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded border transition-colors duration-200 w-auto sm:w-full ${
            view === "tree"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-[var(--background-default)] text-[var(--text-primary)] border-[var(--border-main)] dark:bg-gray-800 dark:text-[var(--text-primary)] dark:border-gray-700"
          }`}
          onClick={() => setView("tree")}
        >
          <FaSitemap /> Tree View
        </button>
      </div>
      {showForm && (
        <CategoryForm
          initial={editCategory}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditCategory(null);
          }}
          allCategories={allCategories}
        />
      )}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-[var(--text-secondary)]">Loading categories...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
          <div className="text-red-600 dark:text-red-300">Error: {error}</div>
        </div>
      )}
      {!loading && !error && categories.length === 0 && (
        <div className="text-center py-8 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
          No categories found. Create your first category!
        </div>
      )}
      {!loading && !error && categories.length > 0 && (
        <div>
          {view === "flat" ? (
            <table className="w-full border mt-4 bg-[var(--background-default)] dark:bg-gray-900 text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-2 border dark:border-gray-700">Name</th>
                  <th className="p-2 border dark:border-gray-700">Parent</th>
                  <th className="p-2 border dark:border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id} className="border-b dark:border-gray-800">
                    <td className="p-2 border dark:border-gray-700">
                      <div>
                        <span className="font-bold text-[var(--text-primary)]">{cat.name}</span>
                        <span className="font-bold text-xs ml-2 text-[var(--text-secondary)]">
                          ID: {cat._id.slice(-6)}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {cat.description || "No description available"}
                      </div>
                    </td>
                    <td className="p-2 border dark:border-gray-700 text-[var(--text-secondary)]">
                      {cat.parent ? getCategoryNameById(cat.parent) : "-"}
                    </td>
                    <td className="p-2 border dark:border-gray-700">
                      <button
                        className="text-blue-600 dark:text-blue-400 mr-2"
                        onClick={() => handleEdit(cat)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 dark:text-red-400"
                        onClick={() => handleDelete(cat._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="mt-4">
              <CategoryTree nodes={categories} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManager;
