import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const DEMO_CREDENTIALS = { email: 'demo@nexusai.com', password: 'demopassword123' };
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30; // seconds

// ─── Tiny sub-components ──────────────────────────────────────────────────────

const Particle = ({ style }) => <div className="lp-particle" style={style} aria-hidden="true" />;

const Spinner = () => (
  <svg className="lp-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
      strokeDasharray="31.416" strokeDashoffset="10" />
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

// ─── Particles background ─────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  style: {
    '--x': `${Math.random() * 100}%`,
    '--y': `${Math.random() * 100}%`,
    '--size': `${Math.random() * 6 + 2}px`,
    '--dur': `${Math.random() * 15 + 10}s`,
    '--del': `${Math.random() * -20}s`,
    '--op': Math.random() * 0.35 + 0.05,
  }
}));

// ─── Main Component ───────────────────────────────────────────────────────────
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [status, setStatus]     = useState('idle'); // idle | loading | success | error
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout]   = useState(0);   // countdown seconds
  const [demoFilled, setDemoFilled] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const emailRef  = useRef(null);
  const timerRef  = useRef(null);

  const from = location.state?.from?.pathname || '/dashboard';

  // Auto-focus email on mount
  useEffect(() => { emailRef.current?.focus(); }, []);

  // Lockout countdown
  useEffect(() => {
    if (lockout <= 0) return;
    timerRef.current = setInterval(() => {
      setLockout(s => {
        if (s <= 1) { clearInterval(timerRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [lockout]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = useCallback((name, value) => {
    switch (name) {
      case 'email':
        if (!value)                          return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
        return '';
      case 'password':
        if (!value)          return 'Password is required.';
        if (value.length < 6) return 'Password must be at least 6 characters.';
        return '';
      default: return '';
    }
  }, []);

  const validateAll = useCallback(() => {
    const newErrors = {};
    ['email', 'password'].forEach(field => {
      const msg = validate(field, formData[field]);
      if (msg) newErrors[field] = msg;
    });
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return Object.keys(newErrors).length === 0;
  }, [formData, validate]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newVal }));

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, newVal) }));
    }
    if (demoFilled) setDemoFilled(false);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockout > 0 || !validateAll()) return;

    try {
      setStatus('loading');
      await login(formData.email, formData.password);
      setStatus('success');
      setTimeout(() => navigate(from, { replace: true }), 600);
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStatus('error');

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockout(LOCKOUT_DURATION);
        setErrors({ form: `Too many failed attempts. Try again in ${LOCKOUT_DURATION}s.` });
      } else {
        setErrors({ form: `Incorrect credentials. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts !== 1 ? 's' : ''} remaining.` });
      }

      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleDemoLogin = () => {
    setFormData({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password, rememberMe: false });
    setErrors({});
    setTouched({ email: true, password: true });
    setDemoFilled(true);
  };

  const isLocked   = lockout > 0;
  const isLoading  = status === 'loading';
  const isSuccess  = status === 'success';
  const isDisabled = isLocked || isLoading || isSuccess;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={`lp-root lp-status--${status}`} role="main">

      {/* ── Animated background ── */}
      <div className="lp-bg" aria-hidden="true">
        <div className="lp-bg-mesh" />
        <div className="lp-bg-glow lp-bg-glow--1" />
        <div className="lp-bg-glow lp-bg-glow--2" />
        <div className="lp-bg-glow lp-bg-glow--3" />
        {PARTICLES.map(p => <Particle key={p.id} style={p.style} />)}
      </div>

      {/* ── Card ── */}
      <div className="lp-card" role="region" aria-label="Sign in form">

        {/* Progress bar on success */}
        {isSuccess && <div className="lp-progress-bar" aria-hidden="true" />}

        {/* ── Logo ── */}
        <button className="lp-logo" onClick={() => navigate('/')} aria-label="Go to homepage">
          <div className="lp-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8" />
                  <stop offset="1" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="2.5" />
              <path d="M12 20 L20 12 L28 20 L20 28 Z" fill="url(#logoGrad)" opacity=".9" />
              <circle cx="20" cy="20" r="4" fill="white" opacity=".95" />
            </svg>
          </div>
          <span className="lp-logo-wordmark">NexusAI</span>
        </button>

        {/* ── Heading ── */}
        <div className="lp-header">
          <h1 className="lp-title">Welcome back</h1>
          <p className="lp-subtitle">Sign in to your AI management dashboard</p>
        </div>

        {/* ── Social logins ── */}
        <div className="lp-social" role="group" aria-label="Social sign-in options">
          <button type="button" className="lp-social-btn" aria-label="Continue with Google">
            <GoogleIcon />
            <span>Google</span>
          </button>
          <button type="button" className="lp-social-btn" aria-label="Continue with GitHub">
            <GitHubIcon />
            <span>GitHub</span>
          </button>
        </div>

        <div className="lp-divider" role="separator">
          <span>or continue with email</span>
        </div>

        {/* ── Demo banner ── */}
        <button
          type="button"
          className={`lp-demo-banner${demoFilled ? ' lp-demo-banner--filled' : ''}`}
          onClick={handleDemoLogin}
          aria-label="Auto-fill demo credentials"
        >
          <span className="lp-demo-pill" aria-hidden="true">DEMO</span>
          <span className="lp-demo-label">
            {demoFilled ? '✓ Demo credentials filled — click Sign In' : 'Click to auto-fill demo credentials'}
          </span>
          <span className="lp-demo-chevron" aria-hidden="true">›</span>
        </button>

        {/* ── Form-level error ── */}
        {errors.form && (
          <div className="lp-alert lp-alert--error" role="alert" aria-live="assertive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errors.form}</span>
            {isLocked && (
              <span className="lp-lockout-timer" aria-live="polite">
                {lockout}s
              </span>
            )}
          </div>
        )}

        {/* ── Login form ── */}
        <form onSubmit={handleSubmit} className="lp-form" noValidate>

          {/* Email */}
          <div className={`lp-field${focusedField === 'email' ? ' lp-field--focused' : ''}${touched.email && errors.email ? ' lp-field--error' : ''}${touched.email && !errors.email && formData.email ? ' lp-field--valid' : ''}`}>
            <label htmlFor="email" className="lp-label">Email address</label>
            <div className="lp-input-wrap">
              <svg className="lp-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className="lp-input"
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isDisabled}
                required
              />
              {touched.email && !errors.email && formData.email && (
                <svg className="lp-input-valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            {touched.email && errors.email && (
              <p id="email-error" className="lp-field-error" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className={`lp-field${focusedField === 'password' ? ' lp-field--focused' : ''}${touched.password && errors.password ? ' lp-field--error' : ''}${touched.password && !errors.password && formData.password ? ' lp-field--valid' : ''}`}>
            <div className="lp-label-row">
              <label htmlFor="password" className="lp-label">Password</label>
              <Link to="/forgot-password" className="lp-forgot-link" tabIndex="0">
                Forgot password?
              </Link>
            </div>
            <div className="lp-input-wrap">
              <svg className="lp-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className="lp-input lp-input--password"
                aria-invalid={!!(touched.password && errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                disabled={isDisabled}
                required
              />
              <button
                type="button"
                className="lp-eye-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                tabIndex="0"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {touched.password && errors.password && (
              <p id="password-error" className="lp-field-error" role="alert">{errors.password}</p>
            )}
          </div>

          {/* Remember me */}
          <label className="lp-remember">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="lp-remember-input"
              disabled={isDisabled}
            />
            <span className="lp-remember-box" aria-hidden="true">
              {formData.rememberMe && (
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="2 6 5 9 10 3" />
                </svg>
              )}
            </span>
            <span className="lp-remember-text">Remember me for 30 days</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className={`lp-submit${isSuccess ? ' lp-submit--success' : ''}`}
            disabled={isDisabled}
            aria-busy={isLoading}
          >
            <span className="lp-submit-inner">
              {isLoading && <Spinner />}
              {isSuccess ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="lp-submit-check" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Signed In!
                </>
              ) : isLoading ? 'Signing in…' : (
                <>
                  Sign In
                  <svg className="lp-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* ── Org login ── */}
        <div className="lp-divider lp-divider--sm" role="separator">
          <span>or</span>
        </div>
        <Link to="/organization-login" className="lp-org-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Sign in with Organization ID
        </Link>

        {/* ── Sign up ── */}
        <p className="lp-signup">
          New to NexusAI?{' '}
          <Link to="/signup" className="lp-signup-link">Create a free account</Link>
        </p>

        {/* ── Security notice ── */}
        <div className="lp-security" aria-label="Security information">
          <ShieldIcon />
          <span>256-bit SSL · SOC 2 Type II · GDPR compliant</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
