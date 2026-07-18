import "./StatCard.css";

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  variant = "default"
}) {
  return (
    <article className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__header">
        <p className="stat-card__label">{label}</p>

        {Icon && (
          <span className="stat-card__icon" aria-hidden="true">
            <Icon size={18} strokeWidth={2} />
          </span>
        )}
      </div>

      <p className="stat-card__value">{value}</p>

      <p className="stat-card__description">{description}</p>
    </article>
  );
}

export default StatCard;