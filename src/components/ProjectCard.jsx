// JCH Portfolio — ProjectCard.jsx
// Composite component used in list views. Imports Tag from window scope.
//
// Variants:
//   "card" (default) — bordered, filled, 12px radius card. Use in galleries.
//   "row"            — hairline-rule list row. Use when many cards stack as
//                      a ledger of projects (portfolio index page).

function ProjectCard({ project, onOpen, total, variant = "card" }) {
  const Tag = window.Tag;
  const cls = variant === "row" ? "t-project-card t-project-card--row" : "t-project-card";
  return (
    <article className={cls} onClick={() => onOpen && onOpen(project.id)}>
      <div className="t-project-card__num">
        {project.num} ／ {String(total).padStart(2, "0")}
      </div>
      <div className="t-project-card__main">
        <h3 className="t-project-card__title">{project.title}</h3>
        <div className="t-project-card__meta">
          {project.year} · {project.duration} · {project.stack}
        </div>
        <p className="t-project-card__desc">{project.summary}</p>
        <div className="t-project-card__tags">
          {project.tags.map((t, i) => <Tag key={i} {...t} />)}
        </div>
      </div>
      <div className="t-project-card__side">View<span className="arrow">→</span></div>
    </article>
  );
}

window.ProjectCard = ProjectCard;
