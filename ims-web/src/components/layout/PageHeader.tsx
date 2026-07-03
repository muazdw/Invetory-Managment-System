import type { ReactNode } from 'react';
import { Button } from '../ui/Button';

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </header>
  );
}

type PanelCardProps = {
  title: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PanelCard({ title, description, toolbar, children, className = '' }: PanelCardProps) {
  return (
    <section className={`panel-card animate-fade-in${className ? ` ${className}` : ''}`}>
      <div className="panel-card-header">
        <div>
          <h2>{title}</h2>
          {description && <p className="panel-card-desc">{description}</p>}
        </div>
        {toolbar && <div className="panel-card-toolbar">{toolbar}</div>}
      </div>
      <div className="panel-card-body">{children}</div>
    </section>
  );
}

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="search-input">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}

export function IconButton({
  icon,
  label,
  onClick,
  variant = 'ghost',
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'ghost' | 'danger';
}) {
  return (
    <Button variant={variant} size="sm" icon={icon} onClick={onClick} aria-label={label}>
      {label}
    </Button>
  );
}
