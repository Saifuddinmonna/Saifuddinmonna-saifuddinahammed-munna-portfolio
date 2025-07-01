import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { myProjectWorksAPI } from "../../../services/apiService";
import { FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import TinyMCEEditor from "../../ui/TinyMCEEditor";
import MarkdownEditor from "../../ui/MarkdownEditor";

const MyProjectWorksDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    myProjectWorksAPI
      .getProjectWork(id)
      .then(data => {
        setProject(data);
      })
      .catch(() => setError("Failed to load project details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }
  if (!project) return null;

  return (
    <div className="max-w-3xl mx-auto bg-[var(--background-paper)] p-6 rounded-lg border border-[var(--border-color)] space-y-6">
      <button
        className="flex items-center gap-2 text-blue-600 hover:underline mb-2"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </button>
      <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {project.category}
        </span>
        {project.technology?.map((tech, idx) => (
          <span
            key={idx}
            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mb-2">
        <div className="font-semibold">Overview:</div>
        <div className="text-[var(--text-secondary)]">{project.overview}</div>
      </div>
      <div className="mb-2">
        <div className="font-semibold">Documentation:</div>
        <div className="border rounded p-2 bg-gray-50 dark:bg-gray-800">
          <TinyMCEEditor value={project.documentation} readOnly />
        </div>
      </div>
      <div className="mb-2">
        <div className="font-semibold">Links:</div>
        <div className="flex flex-col gap-1">
          {project.liveWebsite && (
            <a
              href={project.liveWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Live Website <FaExternalLinkAlt className="inline text-xs" />
            </a>
          )}
          {project.liveWebsiteRepo && (
            <a
              href={project.liveWebsiteRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Frontend Repo <FaExternalLinkAlt className="inline text-xs" />
            </a>
          )}
          {project.liveServersite && (
            <a
              href={project.liveServersite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Backend Live <FaExternalLinkAlt className="inline text-xs" />
            </a>
          )}
          {project.liveServersiteRepo && (
            <a
              href={project.liveServersiteRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Backend Repo <FaExternalLinkAlt className="inline text-xs" />
            </a>
          )}
        </div>
      </div>
      {/* Images */}
      {project.screenshots && project.screenshots.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold mb-1">Screenshots:</div>
          <div className="flex flex-wrap gap-2">
            {project.screenshots.map(img => (
              <img
                key={img._id || img.url}
                src={img.url}
                alt="screenshot"
                className="w-28 h-20 object-cover border rounded"
              />
            ))}
          </div>
        </div>
      )}
      {/* Markdown Docs */}
      {project.mdDocumentation && project.mdDocumentation.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold mb-1">Markdown Documentation:</div>
          {project.mdDocumentation.map((doc, idx) => (
            <div
              key={doc._id || idx}
              className="border rounded p-2 mb-2 bg-gray-50 dark:bg-gray-800"
            >
              <div className="font-bold">{doc.title}</div>
              <div className="text-xs text-gray-500 mb-1">Slug: {doc.slug}</div>
              <MarkdownEditor value={doc.content} readOnly />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjectWorksDetail;
