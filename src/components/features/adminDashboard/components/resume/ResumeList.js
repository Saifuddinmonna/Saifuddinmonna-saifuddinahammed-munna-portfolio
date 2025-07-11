import React from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaFilePdf,
  FaFileWord,
  FaVideo,
} from "react-icons/fa";

const ResumeList = ({
  resumes,
  loading,
  error,
  onAdd,
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        <span className="ml-2 text-gray-700 dark:text-gray-300">Loading resumes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400 text-xl mb-2">📄</div>
        <div className="text-gray-500 dark:text-gray-400">No resumes found.</div>
        <button
          onClick={onAdd}
          className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
        >
          <FaPlus className="inline mr-2" />
          Add Your First Resume
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-[var(--border-main)]">
        <thead>
          <tr className="bg-[var(--background-elevated)]">
            <th className="px-4 py-2 border border-[var(--border-main)] text-[var(--text-primary)]">
              Name & Version
            </th>
            <th className="px-4 py-2 border border-[var(--border-main)] text-[var(--text-primary)]">
              Files
            </th>
            <th className="px-4 py-2 border border-[var(--border-main)] text-[var(--text-primary)]">
              Active
            </th>
            <th className="px-4 py-2 border border-[var(--border-main)] text-[var(--text-primary)]">
              Created
            </th>
            <th className="px-4 py-2 border border-[var(--border-main)] text-[var(--text-primary)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {resumes.map(resume => (
            <tr
              key={resume._id}
              className="hover:bg-[var(--background-elevated)] bg-[var(--background-paper)]"
            >
              <td className="px-4 py-2 border border-[var(--border-main)]">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">
                    {resume.name}
                    {resume.versionName && (
                      <span className="ml-2 text-xs text-[var(--primary-main)]">
                        (v{resume.versionName})
                      </span>
                    )}
                    {resume.forWhichPost && (
                      <span className="ml-2 text-sm text-[var(--text-secondary)]">
                        - {resume.forWhichPost}
                      </span>
                    )}
                  </div>
                  {resume.summary && (
                    <div className="text-xs text-[var(--text-secondary)] truncate max-w-xs">
                      {resume.summary}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 border border-[var(--border-main)]">
                <div className="flex gap-1">
                  {resume.pdfFile && <FaFilePdf className="text-red-500" title="PDF" />}
                  {resume.docxFile && <FaFileWord className="text-blue-500" title="DOCX" />}
                  {resume.videoFile && <FaVideo className="text-purple-500" title="Video" />}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {[resume.pdfFile && "PDF", resume.docxFile && "DOCX", resume.videoFile && "Video"]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </td>
              <td className="px-4 py-2 border border-[var(--border-main)] text-center">
                <button
                  onClick={() => onToggleStatus(resume._id, resume.isActive)}
                  title={resume.isActive ? "Deactivate" : "Activate"}
                  className={resume.isActive ? "text-green-600" : "text-[var(--text-secondary)]"}
                >
                  {resume.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                </button>
              </td>
              <td className="px-4 py-2 border border-[var(--border-main)]">
                <div className="text-sm text-[var(--text-primary)]">
                  {new Date(resume.createdAt).toLocaleDateString()}
                </div>
                {resume.originalCreationDate && (
                  <div className="text-xs text-[var(--text-secondary)]">
                    Original: {new Date(resume.originalCreationDate).toLocaleDateString()}
                  </div>
                )}
              </td>
              <td className="px-4 py-2 border border-[var(--border-main)]">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(resume._id)}
                    className="p-2 bg-[var(--background-elevated)] hover:bg-[var(--background-default)] rounded transition-colors text-[var(--text-primary)]"
                    title="View"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onEdit(resume._id)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-[var(--background-elevated)] dark:hover:bg-[var(--background-default)] rounded transition-colors text-blue-700 dark:text-blue-300"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(resume._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 dark:bg-[var(--background-elevated)] dark:hover:bg-[var(--background-default)] rounded transition-colors text-red-700 dark:text-red-300"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResumeList;
