import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { resumeAPI } from "../../../../../services/apiService";
import ResumeFormModal from "./ResumeFormModal";
import ModernResumeViewer from "./ModernResumeViewer";
import ResumeList from "./ResumeList";
import { useNavigate } from "react-router-dom";

const ResumeAdminDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const navigate = useNavigate();

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

  const handleView = id => {
    const resume = resumes.find(r => r._id === id);
    setViewData(resume);
    setViewModalOpen(true);
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

  // Handler to go to edit page
  const handleEditPage = resume => {
    if (resume && resume._id) {
      navigate(`/admin/dashboard/resumes/edit/${resume._id}`);
      setViewModalOpen(false);
    }
  };

  // Handler to go back (close viewer)
  const handleBack = () => {
    setViewModalOpen(false);
  };

  return (
    <div className="bg-[var(--background-paper)] rounded-lg shadow p-4 border border-[var(--border-main)]">
      <ResumeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editData}
        isEdit={!!editData}
      />

      <ModernResumeViewer
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        resume={viewData}
        onEdit={viewData && viewData._id ? handleEditPage : undefined}
        onBack={handleBack}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">All Resumes</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow"
        >
          <FaPlus /> Add Resume
        </button>
      </div>

      <ResumeList
        resumes={resumes}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default ResumeAdminDashboard;
