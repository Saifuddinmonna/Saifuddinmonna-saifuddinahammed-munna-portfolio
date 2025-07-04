import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPortfolioProjects } from "../../services/apiService";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["portfolio-projects"],
    queryFn: getAllPortfolioProjects,
  });
  if (isLoading) return <div>Loading...</div>;
  const project = projects.find(p => (p._id?.$oid || p._id) === id);
  if (!project) return <div>Project not found</div>;

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "2rem auto",
        background: "#fff",
        borderRadius: 8,
        padding: 24,
      }}
    >
      <Link to="/portfolio">← Back to all projects</Link>
      <h2>{project.name}</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {project.images?.map(img => (
          <img
            key={img.public_id}
            src={img.fullImageUrl}
            alt={project.name}
            style={{ width: 180, borderRadius: 4 }}
          />
        ))}
      </div>
      <p>
        <b>Category:</b> {project.category}
      </p>
      <p>
        <b>Overview:</b> {project.overview}
      </p>
      <div>
        <b>Documentation:</b>
        <div dangerouslySetInnerHTML={{ __html: project.documentation }} />
      </div>
      {project.mdDocumentation?.length > 0 && (
        <div>
          <b>Markdown Docs:</b>
          {project.mdDocumentation.map(doc => (
            <div
              key={doc._id?.$oid || doc._id}
              style={{ margin: "1rem 0", padding: 8, background: "#f9f9f9", borderRadius: 4 }}
            >
              <h4>{doc.title}</h4>
              <pre style={{ whiteSpace: "pre-wrap" }}>{doc.content}</pre>
            </div>
          ))}
        </div>
      )}
      <div>
        <b>Technologies:</b>{" "}
        {Array.isArray(project.technology) ? project.technology.join(", ") : project.technology}
      </div>
      <div style={{ marginTop: 16 }}>
        <a href={project.liveWebsite} target="_blank" rel="noopener noreferrer">
          <button>Live</button>
        </a>
        <a href={project.liveWebsiteRepo} target="_blank" rel="noopener noreferrer">
          <button>Code</button>
        </a>
        {project.liveServersite && (
          <a href={project.liveServersite} target="_blank" rel="noopener noreferrer">
            <button>Backend Live</button>
          </a>
        )}
        {project.liveServersiteRepo && (
          <a href={project.liveServersiteRepo} target="_blank" rel="noopener noreferrer">
            <button>Backend Code</button>
          </a>
        )}
      </div>
    </div>
  );
}
