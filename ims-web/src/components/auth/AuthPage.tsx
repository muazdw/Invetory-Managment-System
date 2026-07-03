import type { FormEvent } from 'react';
import { IconBox, IconLogo, IconWarehouse } from '../icons/Icons';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';

type AuthPageProps = {
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  loading: boolean;
  message: string;
  onSubmit: (e: FormEvent) => void;
};

export function AuthPage({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  companyName,
  setCompanyName,
  address,
  setAddress,
  loading,
  message,
  onSubmit,
}: AuthPageProps) {
  const isLogin = authMode === 'login';
  const alertVariant = message.toLowerCase().includes('welcome') || message.toLowerCase().includes('success')
    ? 'success'
    : message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') || message.includes('invalid')
      ? 'error'
      : 'info';

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-hero">
          <div className="auth-hero-badge">
            <IconLogo size={16} />
          </div>
          <h1>Run your warehouse with clarity</h1>
          <p>
            Modern inventory control for products, suppliers, stock levels, and movement history — all in one place.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <IconWarehouse size={18} />
              </div>
              <div>
                <strong>Real-time stock tracking</strong>
                <span>Monitor inventory levels and low-stock alerts instantly.</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <IconBox size={18} />
              </div>
              <div>
                <strong>Unified product catalog</strong>
                <span>Manage SKUs, pricing, and supplier relationships.</span>
              </div>
            </div>
          </div>
        </div>

        <article className="auth-card">
          <div className="auth-card-header">
            <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
            <p>{isLogin ? 'Sign in to access your workspace.' : 'Set up your company workspace in minutes.'}</p>
          </div>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={`auth-tab${isLogin ? ' auth-tab--active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={`auth-tab${!isLogin ? ' auth-tab--active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <FormField label="Email address">
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                type="email"
                autoComplete="email"
                required
              />
            </FormField>
            <FormField label="Password" hint="Minimum 8 characters">
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={8}
                required
              />
            </FormField>
            {!isLogin && (
              <>
                <FormField label="Company name">
                  <input
                    className="input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                    required
                  />
                </FormField>
                <FormField label="Address" hint="Optional">
                  <input
                    className="input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Business address"
                  />
                </FormField>
              </>
            )}
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              {isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          {message && <Alert variant={alertVariant} message={message} />}

          <p className="auth-footer">Secure access to your company workspace</p>
        </article>
      </div>
    </main>
  );
}
