import React, { useEffect, useState } from "react";
import { resumeAPI } from "../../../../services/apiService";
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff } from "react-icons/fa";

// Simple modal component
const ResumeFormModal = ({ open, onClose, onSubmit, initialData, isEdit }) => {
  const [form, setForm] = useState({
    name: "",
    versionName: "",
    summary: "",
    forWhichPost: "",
    suitableFor: [],
    tags: [],
    isActive: true,
    textContent: "",
    originalCreationDate: "",
    resumeFile: null,
  });
  const [fileLabel, setFileLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        suitableFor: initialData.suitableFor || [],
        tags: initialData.tags || [],
        resumeFile: null, // Don't prefill file
      });
      setFileLabel("");
    } else {
      setForm({
        name: "",
        versionName: "",
        summary: "",
        forWhichPost: "",
        suitableFor: [],
        tags: [],
        isActive: true,
        textContent: "",
        originalCreationDate: "",
        resumeFile: null,
      });
      setFileLabel("");
    }
  }, [initialData, open]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (name === "suitableFor" || name === "tags") {
      setForm(f => ({ ...f, [name]: value.split(",").map(s => s.trim()) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };
  const handleFile = e => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, resumeFile: file }));
    setFileLabel(file ? file.name : "");
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Resume" : "Add Resume"}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="versionName"
            value={form.versionName}
            onChange={handleChange}
            placeholder="Version Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="Summary"
            className="w-full border p-2 rounded"
          />
          <input
            name="forWhichPost"
            value={form.forWhichPost}
            onChange={handleChange}
            placeholder="For Which Post"
            className="w-full border p-2 rounded"
          />
          <input
            name="suitableFor"
            value={form.suitableFor.join(", ")}
            onChange={handleChange}
            placeholder="Suitable For (comma separated)"
            className="w-full border p-2 rounded"
          />
          <input
            name="tags"
            value={form.tags.join(", ")}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="textContent"
            value={form.textContent}
            onChange={handleChange}
            placeholder="Resume Content (HTML allowed)"
            className="w-full border p-2 rounded"
            rows={4}
          />
          <input
            name="originalCreationDate"
            type="date"
            value={form.originalCreationDate ? form.originalCreationDate.slice(0, 10) : ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <label className="block">
            File (PDF, DOCX, Video):
            <input
              type="file"
              accept=".pdf,.docx,.doc,video/*"
              onChange={handleFile}
              className="block mt-1"
            />
            {fileLabel && <span className="text-xs text-gray-600">{fileLabel}</span>}
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="mr-2"
            />{" "}
            Active
          </label>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              {submitting ? "Saving..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResumeAdminDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resumeAPI.getAllResumes();
      setResumes(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };
  const handleEdit = id => {
    const resume = resumes.find(r => r._id === id);
    setEditData(resume);
    setModalOpen(true);
  };
  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await resumeAPI.deleteResume(id);
        fetchResumes();
      } catch (err) {
        alert("Failed to delete resume");
      }
    }
  };
  const handleToggleStatus = async (id, isActive) => {
    try {
      await resumeAPI.toggleResumeStatus(id);
      fetchResumes();
    } catch (err) {
      alert("Failed to toggle status");
    }
  };
  const handleModalSubmit = async form => {
    if (editData) {
      await resumeAPI.updateResume(editData._id, form);
    } else {
      await resumeAPI.createResume(form);
    }
    fetchResumes();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <ResumeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editData}
        isEdit={!!editData}
      />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">All Resumes</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow"
        >
          <FaPlus /> Add Resume
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : resumes.length === 0 ? (
        <div>No resumes found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-yellow-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Version</th>
                <th className="px-4 py-2 border">Active</th>
                <th className="px-4 py-2 border">Created</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map(resume => (
                <tr key={resume._id} className="hover:bg-yellow-50">
                  <td className="px-4 py-2 border">{resume.name}</td>
                  <td className="px-4 py-2 border">{resume.versionName}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleToggleStatus(resume._id, resume.isActive)}
                      title={resume.isActive ? "Deactivate" : "Activate"}
                      className={resume.isActive ? "text-green-600" : "text-gray-400"}
                    >
                      {resume.isActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button
                      onClick={() => handleEdit(resume._id)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => alert("View coming soon")}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
                      title="View"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResumeAdminDashboard;
