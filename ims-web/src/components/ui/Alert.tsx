import { IconAlertTriangle, IconCheck, IconX } from '../icons/Icons';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

type AlertProps = {
  variant?: AlertVariant;
  message: string;
  onDismiss?: () => void;
};

const icons: Record<AlertVariant, React.ReactNode> = {
  info: null,
  success: <IconCheck size={16} />,
  warning: <IconAlertTriangle size={16} />,
  error: <IconAlertTriangle size={16} />,
};

export function Alert({ variant = 'info', message, onDismiss }: AlertProps) {
  if (!message) return null;

  return (
    <div className={`alert alert--${variant} animate-fade-in`} role="alert">
      {icons[variant] && <span className="alert-icon">{icons[variant]}</span>}
      <p>{message}</p>
      {onDismiss && (
        <button type="button" className="alert-dismiss" onClick={onDismiss} aria-label="Dismiss">
          <IconX size={14} />
        </button>
      )}
    </div>
  );
}
