import './StatsCard.css';

export default function StatsCard({ title, value, subtitle, icon, color = 'primary' }) {
    return (
        <div className={`stats-card stats-card--${color}`}>
            <div className="stats-card__icon">{icon}</div>
            <div className="stats-card__content">
                <h3 className="stats-card__title">{title}</h3>
                <div className="stats-card__value">{value}</div>
                {subtitle && <p className="stats-card__subtitle">{subtitle}</p>}
            </div>
        </div>
    );
}
