import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Signup.css';

// ─── Utility: Confetti ────────────────────────────────────────────────────────
const ConfettiCanvas = ({ active }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#8b5cf6', '#06b6d4', '#f472b6', '#4ade80', '#fbbf24', '#f87171'];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      dy: Math.random() * 3 + 1.5,
      dx: (Math.random() - 0.5) * 2,
      rot: Math.random() * 360,
      drot: (Math.random() - 0.5) * 6,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      alpha: 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.y += p.dy;
        p.x += p.dx;
        p.rot += p.drot;
        if (p.y > canvas.height * 0.7) p.alpha -= 0.015;
        p.alpha = Math.max(0, p.alpha);
        if (p.alpha > 0) alive = true;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      if (alive) animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="su-confetti" />;
};

// ─── Floating Label Input ─────────────────────────────────────────────────────
const FloatInput = ({ label, icon, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value && props.value.length > 0;

  return (
    <div className={`su-field ${focused ? 'su-field--focused' : ''} ${error ? 'su-field--error' : ''} ${hasValue ? 'su-field--filled' : ''}`}>
      <span className="su-field__icon">{icon}</span>
      <div className="su-field__wrap">
        <input
          {...props}
          className="su-field__input"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
        />
        <label className="su-field__label">{label}</label>
      </div>
      {error && <span className="su-field__err">{error}</span>}
    </div>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type = 'success', onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`su-toast su-toast--${type}`}>
      <span>{type === 'success' ? '✓' : '!'}</span>
      {message}
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const INDUSTRIES = [
  { value: 'Healthcare',    emoji: '🏥', name: 'Healthcare',         desc: 'Diagnostics, patient care, imaging' },
  { value: 'Finance',       emoji: '💳', name: 'Finance & Banking',  desc: 'Fraud detection, risk, investments' },
  { value: 'Retail',        emoji: '🛍️', name: 'Retail & E-commerce',desc: 'Analytics, inventory, forecasting' },
  { value: 'Manufacturing', emoji: '🏭', name: 'Manufacturing',      desc: 'Maintenance, quality, supply chain' },
  { value: 'Education',     emoji: '🎓', name: 'Education',          desc: 'Personalized learning, analytics' },
  { value: 'Legal',         emoji: '⚖️', name: 'Legal Services',     desc: 'Document AI, case prediction' },
  { value: 'Music',         emoji: '🎵', name: 'Music & Media',      desc: 'Recommendations, royalty tracking' },
  { value: 'Technology',    emoji: '💻', name: 'Technology',         desc: 'DevOps, IT operations, security' },
  { value: 'Logistics',     emoji: '🚚', name: 'Logistics',          desc: 'Route optimization, warehousing' },
  { value: 'RealEstate',    emoji: '🏢', name: 'Real Estate',        desc: 'Valuation, market analysis, CRM' },
  { value: 'Other',         emoji: '🔧', name: 'Other',              desc: 'Custom AI for your specific needs' },
];

const ORG_SIZES = [
  { value: '1-10',    label: 'Startup',        sub: '1–10 employees',      icon: '🌱' },
  { value: '11-50',   label: 'Small Biz',      sub: '11–50 employees',     icon: '🏠' },
  { value: '51-200',  label: 'Medium',         sub: '51–200 employees',    icon: '🏢' },
  { value: '201-1000',label: 'Large Biz',      sub: '201–1000 employees',  icon: '🏙️' },
  { value: '1000+',   label: 'Enterprise',     sub: '1000+ employees',     icon: '🌐' },
];

const INDUSTRY_FEATURES = {
  Healthcare:    ['Patient Diagnosis AI', 'Medical Imaging', 'Treatment Recs'],
  Finance:       ['Fraud Detection AI', 'Risk Models', 'Investment Analytics'],
  Retail:        ['Customer Behavior AI', 'Inventory AI', 'Sales Forecasting'],
  Manufacturing: ['Predictive Maintenance', 'Quality Control AI', 'Production AI'],
  Education:     ['Personalized Learning', 'Student Analytics', 'Auto Grading'],
  Legal:         ['Document Analysis', 'Case Prediction', 'Legal Research AI'],
  Music:         ['Music Analysis AI', 'Recommendation Engine', 'Royalty Tracking'],
  Technology:    ['Code Review AI', 'Ops Automation', 'Security Intelligence'],
  Logistics:     ['Route Optimization', 'Demand Forecasting', 'Warehouse AI'],
  RealEstate:    ['Property Valuation', 'Market Analysis', 'CRM Automation'],
  Other:         ['Custom AI Models', 'Data Analytics', 'Process Automation'],
};

const PANEL_INFO = [
  {
    icon: '🧠',
    title: 'Tell us about yourself',
    desc:  'Your personal details help us personalize your AI experience from day one.',
    tips:  ['Use your work email for team access', 'Your name appears on all reports'],
  },
  {
    icon: '🏢',
    title: 'About your organization',
    desc:  'We tailor AI models and workflows specifically to your industry vertical.',
    tips:  ['Industry selection unlocks specialized AI', 'Size helps us recommend the right plan'],
  },
  {
    icon: '✅',
    title: 'Almost there!',
    desc:  'Review your details. A secure Organization ID and Password will be generated instantly.',
    tips:  ['Credentials are shown once — save them', 'You can add team members after setup'],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Signup = () => {
  const navigate = useNavigate();
  const { signupWithOrganization } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '', email: '', organizationName: '',
    industry: '', organizationSize: '',
    agreeToTerms: false, subscribeNewsletter: true,
  });
  const [errors, setErrors]   = useState({});
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(1);
  const [direction, setDirection] = useState('forward');
  const [animating, setAnimating] = useState(false);
  const [creds, setCreds]     = useState(null);
  const [toasts, setToasts]   = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
  };

  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const validate = (s) => {
    const errs = {};
    if (s === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
      if (!formData.email.trim()) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email address';
    }
    if (s === 2) {
      if (!formData.organizationName.trim()) errs.organizationName = 'Organization name is required';
      if (!formData.industry) errs.industry = 'Please select an industry';
      if (!formData.organizationSize) errs.organizationSize = 'Please select a size';
    }
    if (s === 3) {
      if (!formData.agreeToTerms) errs.agreeToTerms = 'You must agree to the terms';
    }
    return errs;
  };

  const transition = (newStep, dir) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
    }, 320);
  };

  const nextStep = () => {
    const errs = validate(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    transition(step + 1, 'forward');
  };

  const prevStep = () => transition(step - 1, 'back');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(3);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setError('');
      setLoading(true);
      const result = await signupWithOrganization(formData);
      setCreds(result.credentials);
      transition(4, 'forward');
    } catch (err) {
      setError('Failed to create account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      addToast('Copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      addToast('Copy failed', 'error');
    }
  };

  const openEmailDraft = () => {
    const subject = `Welcome to NexusAI – ${formData.organizationName}`;
    const body = `Hello ${formData.fullName},\n\nYour organization "${formData.organizationName}" has been created!\n\nOrganization ID: ${creds?.orgId}\nPassword: ${creds?.password}\nEmail: ${formData.email}\n\nLogin: http://localhost:3000/organization-login\n\nSave these credentials securely.\n\n— NexusAI Team`;
    window.open(`mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const downloadCredentials = () => {
    const text = `NexusAI Organization Credentials\n${'─'.repeat(40)}\nOrganization: ${formData.organizationName}\nOrganization ID: ${creds?.orgId}\nPassword: ${creds?.password}\nEmail: ${formData.email}\nLogin URL: http://localhost:3000/organization-login\n${'─'.repeat(40)}\nGenerated: ${new Date().toLocaleString()}\n\n⚠ Save these credentials securely.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${formData.organizationName.replace(/\s+/g,'_')}_credentials.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Credentials file downloaded!');
  };

  // ── Step Content ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      /* ── Step 1 ── */
      case 1: return (
        <div className="su-step">
          <FloatInput
            label="Full Name"
            icon="👤"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            autoFocus
            error={errors.fullName}
          />
          <FloatInput
            label="Work Email Address"
            icon="✉️"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <div className="su-hint">
            <span>🔒</span>
            Your information is encrypted and never shared with third parties.
          </div>
        </div>
      );

      /* ── Step 2 ── */
      case 2: return (
        <div className="su-step">
          <FloatInput
            label="Organization Name"
            icon="🏢"
            name="organizationName"
            type="text"
            value={formData.organizationName}
            onChange={handleChange}
            error={errors.organizationName}
          />

          <div className="su-form-group">
            <div className={`su-group-label ${errors.industry ? 'err' : ''}`}>
              Select Industry {errors.industry && <span className="su-inline-err">— {errors.industry}</span>}
            </div>
            <div className="su-industry-grid">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind.value}
                  type="button"
                  className={`su-industry-card ${formData.industry === ind.value ? 'su-industry-card--active' : ''}`}
                  onClick={() => { setFormData(f => ({ ...f, industry: ind.value })); setErrors(e => ({ ...e, industry: '' })); }}
                >
                  <span className="su-industry-card__emoji">{ind.emoji}</span>
                  <span className="su-industry-card__name">{ind.name}</span>
                  <span className="su-industry-card__desc">{ind.desc}</span>
                  <span className="su-industry-card__check">✓</span>
                </button>
              ))}
            </div>
          </div>

          {formData.industry && (
            <div className="su-feature-preview">
              <div className="su-feature-preview__label">
                ✦ AI features unlocked for {INDUSTRIES.find(i => i.value === formData.industry)?.name}
              </div>
              <div className="su-feature-preview__tags">
                {(INDUSTRY_FEATURES[formData.industry] || []).map(f => (
                  <span key={f} className="su-feature-tag">{f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="su-form-group">
            <div className={`su-group-label ${errors.organizationSize ? 'err' : ''}`}>
              Organization Size {errors.organizationSize && <span className="su-inline-err">— {errors.organizationSize}</span>}
            </div>
            <div className="su-size-grid">
              {ORG_SIZES.map(sz => (
                <button
                  key={sz.value}
                  type="button"
                  className={`su-size-card ${formData.organizationSize === sz.value ? 'su-size-card--active' : ''}`}
                  onClick={() => { setFormData(f => ({ ...f, organizationSize: sz.value })); setErrors(e => ({ ...e, organizationSize: '' })); }}
                >
                  <span className="su-size-card__icon">{sz.icon}</span>
                  <span className="su-size-card__label">{sz.label}</span>
                  <span className="su-size-card__sub">{sz.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );

      /* ── Step 3 ── */
      case 3: return (
        <div className="su-step">
          <div className="su-review">
            <div className="su-review-card">
              <div className="su-review-card__head">
                <span>👤</span> Personal
                <button type="button" className="su-review-edit" onClick={() => transition(1, 'back')}>Edit</button>
              </div>
              <div className="su-review-row"><span>Name</span><strong>{formData.fullName}</strong></div>
              <div className="su-review-row"><span>Email</span><strong>{formData.email}</strong></div>
            </div>

            <div className="su-review-card">
              <div className="su-review-card__head">
                <span>🏢</span> Organization
                <button type="button" className="su-review-edit" onClick={() => transition(2, 'back')}>Edit</button>
              </div>
              <div className="su-review-row"><span>Name</span><strong>{formData.organizationName}</strong></div>
              <div className="su-review-row"><span>Industry</span><strong>{INDUSTRIES.find(i => i.value === formData.industry)?.name}</strong></div>
              <div className="su-review-row"><span>Size</span><strong>{ORG_SIZES.find(s => s.value === formData.organizationSize)?.label}</strong></div>
            </div>

            <div className="su-security-badge">
              <div className="su-security-badge__icon">🔐</div>
              <div>
                <strong>Secure credentials generated instantly</strong>
                <p>Your Organization ID & Password are created on submission</p>
              </div>
            </div>

            <div className="su-checkboxes">
              <label className={`su-checkbox ${errors.agreeToTerms ? 'su-checkbox--err' : ''}`}>
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
                <span className="su-checkbox__box" />
                <span className="su-checkbox__text">
                  I agree to the{' '}
                  <Link to="/terms" className="su-link">Terms of Service</Link> and{' '}
                  <Link to="/privacy" className="su-link">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeToTerms && <p className="su-inline-err su-inline-err--block">{errors.agreeToTerms}</p>}

              <label className="su-checkbox">
                <input type="checkbox" name="subscribeNewsletter" checked={formData.subscribeNewsletter} onChange={handleChange} />
                <span className="su-checkbox__box" />
                <span className="su-checkbox__text">Send me product updates and AI insights</span>
              </label>
            </div>
          </div>
        </div>
      );

      /* ── Step 4 — Success ── */
      case 4: return (
        <div className="su-step su-success">
          <ConfettiCanvas active={step === 4} />

          <div className="su-success__hero">
            <div className="su-success__icon">🎉</div>
            <h2 className="su-success__title">Organization Created!</h2>
            <p className="su-success__sub">
              {creds?.emailSent
                ? 'Credentials sent to your email inbox.'
                : 'Save the credentials below — they won\'t be shown again.'}
            </p>
            {creds?.emailSent
              ? <div className="su-pill su-pill--green">✅ Email sent successfully</div>
              : <div className="su-pill su-pill--amber">📧 Save credentials manually</div>}
          </div>

          <div className="su-cred-card">
            <div className="su-cred-card__head">
              <span>🔑 Login Credentials</span>
              <span className="su-cred-card__warn">Save securely — shown once</span>
            </div>

            {[
              { key: 'orgId',    label: 'Organization ID', value: creds?.orgId, icon: '🏢' },
              { key: 'password', label: 'Password',         value: creds?.password, icon: '🔒' },
              { key: 'email',    label: 'Email',            value: formData.email, icon: '✉️' },
            ].map(({ key, label, value, icon }) => (
              <div className="su-cred-row" key={key}>
                <span className="su-cred-row__icon">{icon}</span>
                <div className="su-cred-row__info">
                  <span className="su-cred-row__label">{label}</span>
                  <code className="su-cred-row__val">{value}</code>
                </div>
                <button
                  type="button"
                  className={`su-copy-btn ${copiedKey === key ? 'su-copy-btn--done' : ''}`}
                  onClick={() => copyToClipboard(value, key)}
                >
                  {copiedKey === key ? '✓ Copied' : '⧉ Copy'}
                </button>
              </div>
            ))}
          </div>

          <div className="su-save-row">
            <button type="button" className="su-save-btn" onClick={openEmailDraft}>
              <span>📨</span> Email Draft
            </button>
            <button type="button" className="su-save-btn" onClick={downloadCredentials}>
              <span>💾</span> Download .txt
            </button>
          </div>

          <div className="su-next-steps">
            <div className="su-next-steps__label">Next steps</div>
            {[
              { n: '1', title: 'Login to Dashboard',       desc: 'Use your Organization ID & Password' },
              { n: '2', title: 'Configure AI Models',       desc: 'Set up industry-specific models' },
              { n: '3', title: 'Invite Your Team',          desc: 'Add members and assign roles' },
            ].map(ns => (
              <div className="su-next-step" key={ns.n}>
                <div className="su-next-step__num">{ns.n}</div>
                <div>
                  <strong>{ns.title}</strong>
                  <p>{ns.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      default: return null;
    }
  };

  const panelInfo = step <= 3 ? PANEL_INFO[step - 1] : null;
  const progress  = step < 4 ? ((step - 1) / 2) * 100 : 100;

  return (
    <div className="su-root">
      {/* Toast Stack */}
      <div className="su-toast-stack">
        {toasts.map(t => (
          <Toast key={t.id} message={t.msg} type={t.type} onDone={() => removeToast(t.id)} />
        ))}
      </div>

      {/* ── Left Panel ────────────────────────────────────────────────────── */}
      <aside className="su-panel">
        <div className="su-panel__orb su-panel__orb--1" />
        <div className="su-panel__orb su-panel__orb--2" />

        <button className="su-panel__logo" onClick={() => navigate('/')}>
          <span className="su-panel__logo-icon">🌌</span>
          <span className="su-panel__logo-text">NexusAI</span>
        </button>

        {panelInfo && (
          <div className="su-panel__body">
            <div className="su-panel__icon">{panelInfo.icon}</div>
            <h2 className="su-panel__title">{panelInfo.title}</h2>
            <p className="su-panel__desc">{panelInfo.desc}</p>
            <ul className="su-panel__tips">
              {panelInfo.tips.map(tip => (
                <li key={tip}><span>✦</span>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {step === 4 && (
          <div className="su-panel__body">
            <div className="su-panel__icon">🚀</div>
            <h2 className="su-panel__title">You're all set!</h2>
            <p className="su-panel__desc">Welcome to the NexusAI ecosystem. Your AI journey starts now.</p>
          </div>
        )}

        {/* Step indicators */}
        {step < 4 && (
          <div className="su-panel__steps">
            {['Personal', 'Organization', 'Review'].map((label, i) => (
              <div key={label} className={`su-panel__step ${i + 1 === step ? 'active' : i + 1 < step ? 'done' : ''}`}>
                <div className="su-panel__step-dot">
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="su-panel__footer">
          Trusted by 10,000+ organizations worldwide
        </div>
      </aside>

      {/* ── Right Form ────────────────────────────────────────────────────── */}
      <main className="su-main">
        <div className="su-card">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="su-progress">
              <div className="su-progress__fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* Card Header */}
          <div className="su-card__head">
            {step < 4 && (
              <div className="su-step-badge">Step {step} of 3</div>
            )}
            <h1 className="su-card__title">
              {step === 1 && 'Personal Details'}
              {step === 2 && 'Organization Setup'}
              {step === 3 && 'Review & Create'}
              {step === 4 && 'Welcome to NexusAI 🎉'}
            </h1>
            <p className="su-card__sub">
              {step === 1 && 'Start by telling us a little about yourself'}
              {step === 2 && 'Help us tailor AI solutions for your team'}
              {step === 3 && 'Everything looks good? Let\'s launch!'}
              {step === 4 && 'Your organization is live and ready'}
            </p>
          </div>

          {/* Global Error */}
          {error && (
            <div className="su-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} noValidate>
            <div className={`su-step-wrap ${animating ? (direction === 'forward' ? 'su-step-wrap--exit-left' : 'su-step-wrap--exit-right') : ''}`}>
              {renderStep()}
            </div>

            {/* Navigation */}
            {step < 4 && (
              <div className="su-nav">
                {step > 1
                  ? <button type="button" className="su-nav__back" onClick={prevStep}>← Back</button>
                  : <div />}

                {step < 3
                  ? <button type="button" className="su-nav__next" onClick={nextStep}>
                      Continue <span>→</span>
                    </button>
                  : <button type="submit" className="su-nav__submit" disabled={loading}>
                      {loading
                        ? <><span className="su-spinner" /> Creating…</>
                        : <>Create Organization ✦</>}
                    </button>}
              </div>
            )}

            {/* Success Actions */}
            {step === 4 && (
              <div className="su-success-nav">
                <button type="button" className="su-nav__submit" onClick={() => navigate('/organization-login')}>
                  Go to Dashboard →
                </button>
                <button type="button" className="su-nav__back" onClick={() => navigate('/')}>
                  Back to Home
                </button>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          {step < 4 && (
            <p className="su-signin">
              Already registered?{' '}
              <Link to="/organization-login" className="su-link">Sign in →</Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Signup;
