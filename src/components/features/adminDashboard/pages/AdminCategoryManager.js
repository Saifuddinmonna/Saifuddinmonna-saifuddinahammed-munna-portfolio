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
        <span className="font-medium">{cat.name}</span>
        <button className="ml-2 text-xs text-blue-600" onClick={() => onEdit(cat)}>
          Edit
        </button>
        <button className="ml-2 text-xs text-red-600" onClick={() => onDelete(cat._id)}>
          Delete
        </button>
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
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Blog Category Manager</h1>
        <button
          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded"
          onClick={handleAdd}
        >
          <FaPlus /> Add Category
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded border ${
            view === "flat" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setView("flat")}
        >
          <FaListUl /> Flat View
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded border ${
            view === "tree" ? "bg-blue-600 text-white" : "bg-white"
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
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {!loading && !error && (
        <div>
          {view === "flat" ? (
            <table className="w-full border mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Parent</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id}>
                    <td className="p-2 border">{cat.name}</td>
                    <td className="p-2 border">
                      {cat.parent ? getCategoryNameById(cat.parent) : "-"}
                    </td>
                    <td className="p-2 border">
                      <button className="text-blue-600 mr-2" onClick={() => handleEdit(cat)}>
                        <FaEdit />
                      </button>
                      <button className="text-red-600" onClick={() => handleDelete(cat._id)}>
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
