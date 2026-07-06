import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'warning' | 'success';
  onClick?: () => void;
};

export function StatCard({ label, value, icon, variant = 'default', onClick }: StatCardProps) {
  const className = `stat-card stat-card--${variant}${onClick ? ' stat-card--interactive' : ''} animate-fade-in`;

  const content = (
    <>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        aria-label={`View ${label.toLowerCase()} (${value})`}
      >
        {content}
      </button>
    );
  }

  return <article className={className}>{content}</article>;
}
