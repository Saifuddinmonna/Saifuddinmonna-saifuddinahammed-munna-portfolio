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
      <table className="min-w-full table-auto border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-yellow-100 dark:bg-yellow-900">
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              Name
            </th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              Version
            </th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              Files
            </th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              Active
            </th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              Created
            </th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {resumes.map(resume => (
            <tr
              key={resume._id}
              className="hover:bg-yellow-50 dark:hover:bg-yellow-900/50 bg-white dark:bg-gray-800"
            >
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{resume.name}</div>
                  {resume.summary && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-xs">
                      {resume.summary}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {resume.versionName}
                  </div>
                  {resume.forWhichPost && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {resume.forWhichPost}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                <div className="flex gap-1">
                  {resume.pdfFile && <FaFilePdf className="text-red-500" title="PDF" />}
                  {resume.docxFile && <FaFileWord className="text-blue-500" title="DOCX" />}
                  {resume.videoFile && <FaVideo className="text-purple-500" title="Video" />}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {[resume.pdfFile && "PDF", resume.docxFile && "DOCX", resume.videoFile && "Video"]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">
                <button
                  onClick={() => onToggleStatus(resume._id, resume.isActive)}
                  title={resume.isActive ? "Deactivate" : "Activate"}
                  className={resume.isActive ? "text-green-600" : "text-gray-400"}
                >
                  {resume.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                </button>
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                <div className="text-sm text-gray-900 dark:text-white">
                  {new Date(resume.createdAt).toLocaleDateString()}
                </div>
                {resume.originalCreationDate && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Original: {new Date(resume.originalCreationDate).toLocaleDateString()}
                  </div>
                )}
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(resume._id)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                    title="View"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onEdit(resume._id)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded transition-colors text-blue-700 dark:text-blue-300"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(resume._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded transition-colors text-red-700 dark:text-red-300"
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
