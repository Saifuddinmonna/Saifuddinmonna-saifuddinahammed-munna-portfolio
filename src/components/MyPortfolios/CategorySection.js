import MyPortfolioCard from "./MyPortfolioCard";

export default function CategorySection({ category, projects }) {
  if (!projects || projects.length === 0) return null;
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ marginBottom: 12 }}>{category}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {projects.map(project => (
          <MyPortfolioCard key={project._id?.$oid || project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
