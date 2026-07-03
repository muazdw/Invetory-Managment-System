import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'warning' | 'success';
};

export function StatCard({ label, value, icon, variant = 'default' }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${variant} animate-fade-in`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    </article>
  );
}
