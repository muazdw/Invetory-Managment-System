import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  loading,
  fullWidth,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}${fullWidth ? ' btn--full' : ''}${className ? ` ${className}` : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="btn-icon">{icon}</span>
      ) : null}
      {children && <span className="btn-label">{children}</span>}
    </button>
  );
}
