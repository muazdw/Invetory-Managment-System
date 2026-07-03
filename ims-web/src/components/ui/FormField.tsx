import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, hint, error, children }: FormFieldProps) {
  return (
    <div className={`form-field${error ? ' form-field--error' : ''}`}>
      <label className="form-label">{label}</label>
      {children}
      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string };

export function Input({ label, hint, className = '', id, ...props }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const input = <input id={inputId} className={`input${className ? ` ${className}` : ''}`} {...props} />;

  if (!label) return input;

  return (
    <FormField label={label} hint={hint}>
      {input}
    </FormField>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string };

export function Select({ label, hint, children, className = '', id, ...props }: SelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const select = (
    <select id={selectId} className={`select${className ? ` ${className}` : ''}`} {...props}>
      {children}
    </select>
  );

  if (!label) return select;

  return (
    <FormField label={label} hint={hint}>
      {select}
    </FormField>
  );
}
