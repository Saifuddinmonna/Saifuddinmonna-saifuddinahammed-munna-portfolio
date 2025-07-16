import { useNavigate } from "react-router-dom";

export default function MyPortfolioCard({ project }) {
  const navigate = useNavigate();
  const id = project._id?.$oid || project._id;

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "8px",
        padding: "1rem",
        width: "250px",
        background: "#fff",
      }}
    >
      <img
        src={project.images?.[0]?.thumbnailUrl}
        alt={project.name}
        style={{ width: "100%", borderRadius: "4px" }}
      />
      <h3>{project.name}</h3>
      <p>{project.category}</p>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <a href={project.liveWebsite} target="_blank" rel="noopener noreferrer">
          <button>Live</button>
        </a>
        <a href={project.liveWebsiteRepo} target="_blank" rel="noopener noreferrer">
          <button>Code</button>
        </a>
        <button onClick={() => navigate(`/portfolio/${id}`)}>Show Details</button>
      </div>
    </div>
  );
}
