export default function StatCard({ icon, title, value, subtitle, trend, color = '#6366f1', iconBg }) {
  const isPositive = trend && trend > 0;
  const bg = iconBg || (color + '18');

  return (
    <div className="stat-card" style={{ '--accent': color }}>
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: bg, color }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-title">{title}</p>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  );
}
