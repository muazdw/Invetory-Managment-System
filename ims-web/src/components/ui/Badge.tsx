import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
};

export function Badge({ variant = 'default', children, dot, className = '' }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}${className ? ` ${className}` : ''}`}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
