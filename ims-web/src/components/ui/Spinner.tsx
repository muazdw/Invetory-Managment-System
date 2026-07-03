type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

export function Spinner({ size = 'md', label = 'Loading' }: SpinnerProps) {
  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label={label}>
      <span className="spinner-ring" />
    </div>
  );
}

export function LoadingOverlay({ label = 'Loading data...' }: { label?: string }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <Spinner size="lg" label={label} />
      <p>{label}</p>
    </div>
  );
}
