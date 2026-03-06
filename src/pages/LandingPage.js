import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LandingPage.css';

// ─── Particle Canvas Background ───────────────────────────────────────────────
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

// ─── Feature Card Data ─────────────────────────────────────────────────────────
const features = [
  {
    icon: '🧠', title: 'Custom AI Models', color: '#8b5cf6',
    desc: 'Train and deploy industry-specific AI models with our no-code platform — from healthcare diagnostics to financial forecasting.',
    items: ['Drag & Drop Model Builder', 'AutoML Capabilities', 'Real-time Training'],
  },
  {
    icon: '📈', title: 'Smart Analytics', color: '#06b6d4',
    desc: 'Transform raw data into actionable insights with advanced analytics dashboards and predictive modeling.',
    items: ['Real-time Dashboards', 'Predictive Insights', 'Custom Reports'],
  },
  {
    icon: '⚡', title: 'Workflow Automation', color: '#f59e0b',
    desc: 'Automate repetitive tasks and complex workflows with AI-powered tools and intelligent process management.',
    items: ['Smart Automation', 'Process Optimization', 'API Integrations'],
  },
  {
    icon: '🛡️', title: 'Enterprise Security', color: '#10b981',
    desc: 'Bank-grade security with end-to-end encryption, compliance frameworks, and role-based access control.',
    items: ['SOC 2 Compliant', 'GDPR Ready', 'Role-based Access'],
  },
  {
    icon: '🌐', title: 'Multi-Industry', color: '#ec4899',
    desc: 'Pre-built templates for healthcare, finance, retail, manufacturing, education, and more.',
    items: ['Industry Templates', 'Custom Workflows', 'Compliance Tools'],
  },
  {
    icon: '🔧', title: 'API & Integrations', color: '#f97316',
    desc: 'Seamlessly connect with your existing tools through our comprehensive API ecosystem.',
    items: ['REST API', 'Webhook Support', '300+ Integrations'],
  },
];

const industries = [
  { icon: '🏥', name: 'Healthcare', desc: 'Patient diagnostics, treatment optimization, medical imaging' },
  { icon: '💳', name: 'Finance', desc: 'Fraud detection, risk assessment, algorithmic trading' },
  { icon: '🛍️', name: 'Retail', desc: 'Customer analytics, inventory, personalized marketing' },
  { icon: '🏭', name: 'Manufacturing', desc: 'Predictive maintenance, quality control, supply chain' },
  { icon: '🎓', name: 'Education', desc: 'Personalized learning, student analytics, automation' },
  { icon: '🚚', name: 'Logistics', desc: 'Route optimization, demand forecasting, warehousing' },
];

// ─── Animated Counter ──────────────────────────────────────────────────────────
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const numTarget = parseFloat(target);
        const duration = 1800;
        const steps = 60;
        const increment = numTarget / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numTarget) {
            setCount(numTarget);
            clearInterval(timer);
          } else {
            setCount(parseFloat(current.toFixed(1)));
          }
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Main Component ────────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); navigate('/'); }
    catch (error) { console.error('Failed to log out', error); }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="lp-root">
      <ParticleCanvas />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className={`lp-header ${isScrolled ? 'lp-header--scrolled' : ''}`}>
        <div className="lp-header__inner">
          <button className="lp-logo" onClick={() => navigate('/')}>
            <span className="lp-logo__icon">🌌</span>
            <span className="lp-logo__text">NexusAI</span>
          </button>

          <nav className="lp-nav">
            <button className="lp-nav__link" onClick={() => scrollTo('features')}>Features</button>
            <button className="lp-nav__link" onClick={() => scrollTo('industries')}>Industries</button>
            <button className="lp-nav__link" onClick={() => scrollTo('cta')}>Pricing</button>
          </nav>

          <div className="lp-header__actions">
            {currentUser ? (
              <>
                <span className="lp-welcome">👋 {currentUser.email}</span>
                <button className="lp-btn lp-btn--ghost" onClick={handleLogout}>Logout</button>
                <button className="lp-btn lp-btn--primary" onClick={() => navigate('/dashboard')}>Dashboard →</button>
              </>
            ) : (
              <>
                <button className="lp-btn lp-btn--ghost" onClick={() => navigate('/login')}>Sign In</button>
                <button className="lp-btn lp-btn--primary" onClick={() => navigate('/signup')}>Get Started Free</button>
              </>
            )}
          </div>

          <button className="lp-hamburger" onClick={() => setMobileMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lp-mobile-menu ${mobileMenuOpen ? 'lp-mobile-menu--open' : ''}`}>
          <button onClick={() => scrollTo('features')}>Features</button>
          <button onClick={() => scrollTo('industries')}>Industries</button>
          <button onClick={() => scrollTo('cta')}>Pricing</button>
          <hr />
          {currentUser ? (
            <>
              <button onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Sign In</button>
              <button onClick={() => navigate('/signup')}>Get Started Free</button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero__orb lp-hero__orb--1" />
        <div className="lp-hero__orb lp-hero__orb--2" />
        <div className="lp-hero__orb lp-hero__orb--3" />

        <div className="lp-hero__inner">
          <div className="lp-hero__copy">
            <div className="lp-badge lp-badge--pulse">
              <span className="lp-badge__dot" />
              ✨ Next-Gen AI Platform — Now in Beta
            </div>

            <h1 className="lp-hero__title">
              Intelligent Automation
              <br />
              <span className="lp-gradient-text">For Every Industry</span>
            </h1>

            <p className="lp-hero__sub">
              Deploy custom AI models, gain real-time insights, and automate workflows
              across healthcare, finance, retail, manufacturing, and more — all from
              one enterprise-grade platform.
            </p>

            <div className="lp-hero__cta">
              <button className="lp-btn lp-btn--primary lp-btn--lg lp-btn--glow" onClick={() => navigate('/signup')}>
                Start Free Trial
                <span className="lp-btn__sparkle">✦</span>
              </button>
              <button className="lp-btn lp-btn--outline lp-btn--lg" onClick={() => scrollTo('features')}>
                Explore Features →
              </button>
            </div>

            <div className="lp-hero__stats">
              {[
                { val: '99.9', suf: '%', label: 'Uptime SLA' },
                { val: '50', suf: '+', label: 'Industries' },
                { val: '10', suf: 'k+', label: 'Companies' },
                { val: '24', suf: '/7', label: 'AI Support' },
              ].map(({ val, suf, label }) => (
                <div className="lp-stat" key={label}>
                  <div className="lp-stat__num">
                    <Counter target={val} suffix={suf} />
                  </div>
                  <div className="lp-stat__label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Mock */}
          <div className="lp-hero__visual" aria-hidden="true">
            <div className="lp-dashboard">
              <div className="lp-dashboard__bar">
                <span className="lp-dot lp-dot--red" />
                <span className="lp-dot lp-dot--yellow" />
                <span className="lp-dot lp-dot--green" />
                <span className="lp-dashboard__title">NexusAI Dashboard</span>
              </div>

              <div className="lp-dashboard__body">
                <div className="lp-dashboard__metrics">
                  {[
                    { label: 'Accuracy', val: '94.2%', up: true },
                    { label: 'Processed', val: '1.2M', up: true },
                    { label: 'Latency', val: '8ms', up: false },
                  ].map(m => (
                    <div className="lp-metric" key={m.label}>
                      <span className="lp-metric__label">{m.label}</span>
                      <span className="lp-metric__val">{m.val}</span>
                      <span className={`lp-metric__badge ${m.up ? 'up' : 'down'}`}>{m.up ? '▲' : '▼'}</span>
                    </div>
                  ))}
                </div>

                <div className="lp-chart">
                  {[55, 72, 48, 90, 68, 95, 80].map((h, i) => (
                    <div className="lp-chart__col" key={i}>
                      <div className="lp-chart__bar" style={{ '--h': `${h}%`, '--delay': `${i * 0.08}s` }} />
                      <span className="lp-chart__label">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="lp-ai-feed">
                  <div className="lp-ai-msg lp-ai-msg--in">
                    <span>🤖</span> Model training complete
                  </div>
                  <div className="lp-ai-msg lp-ai-msg--in lp-ai-msg--delay">
                    <span>📊</span> Accuracy: 94.2% — Excellent
                  </div>
                  <div className="lp-ai-msg lp-ai-msg--out lp-ai-msg--delay2">
                    Deploy to production →
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Chips */}
            <div className="lp-chip lp-chip--1"><span>🤖</span> ML Models</div>
            <div className="lp-chip lp-chip--2"><span>📊</span> Analytics</div>
            <div className="lp-chip lp-chip--3"><span>⚡</span> Automation</div>
            <div className="lp-chip lp-chip--4"><span>🛡️</span> Security</div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="lp-scroll-hint" onClick={() => scrollTo('features')}>
          <div className="lp-scroll-hint__wheel" />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="lp-section lp-features">
        <div className="lp-section__inner">
          <div className="lp-section__head">
            <div className="lp-badge">🔥 Powerful Features</div>
            <h2 className="lp-section__title">Everything You Need to <span className="lp-gradient-text">Succeed with AI</span></h2>
            <p className="lp-section__sub">Designed for enterprises, adaptable for any industry</p>
          </div>

          <div className="lp-features__grid">
            {features.map((f) => (
              <div className="lp-feature-card" key={f.title} style={{ '--accent': f.color }}>
                <div className="lp-feature-card__glow" />
                <div className="lp-feature-card__icon">{f.icon}</div>
                <h3 className="lp-feature-card__title">{f.title}</h3>
                <p className="lp-feature-card__desc">{f.desc}</p>
                <ul className="lp-feature-card__list">
                  {f.items.map(item => <li key={item}><span>✓</span>{item}</li>)}
                </ul>
                <div className="lp-feature-card__bar" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ─────────────────────────────────────────────────────── */}
      <section id="industries" className="lp-section lp-industries">
        <div className="lp-industries__blob" />
        <div className="lp-section__inner">
          <div className="lp-section__head">
            <h2 className="lp-section__title">Trusted Across <span className="lp-gradient-text">Industries</span></h2>
            <p className="lp-section__sub">Custom AI solutions for every sector</p>
          </div>

          <div className="lp-industries__grid">
            {industries.map((ind) => (
              <div className="lp-industry-card" key={ind.name}>
                <div className="lp-industry-card__icon">{ind.icon}</div>
                <h4 className="lp-industry-card__name">{ind.name}</h4>
                <p className="lp-industry-card__desc">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section id="cta" className="lp-cta">
        <div className="lp-cta__orb lp-cta__orb--1" />
        <div className="lp-cta__orb lp-cta__orb--2" />
        <div className="lp-section__inner lp-cta__inner">
          <div className="lp-badge lp-badge--light">🚀 Get Started Today</div>
          <h2 className="lp-cta__title">
            Ready to Transform Your Business<br />
            <span className="lp-gradient-text">with AI?</span>
          </h2>
          <p className="lp-cta__sub">
            Join thousands of companies already using NexusAI to drive innovation and growth.
          </p>
          <div className="lp-cta__actions">
            <button className="lp-btn lp-btn--primary lp-btn--xl lp-btn--glow" onClick={() => navigate('/signup')}>
              Start Free Trial
            </button>
            <button className="lp-btn lp-btn--outline lp-btn--xl" onClick={() => navigate('/login')}>
              Schedule Demo
            </button>
          </div>
          <div className="lp-cta__perks">
            <span>✓ No credit card required</span>
            <span>✓ 14-day free trial</span>
            <span>✓ Full platform access</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-section__inner">
          <div className="lp-footer__top">
            <div className="lp-footer__brand">
              <div className="lp-logo">
                <span className="lp-logo__icon">🌌</span>
                <span className="lp-logo__text">NexusAI</span>
              </div>
              <p>Empowering businesses with intelligent AI solutions since 2024.</p>
              <div className="lp-footer__socials">
                {['𝕏', 'in', 'gh', '▶'].map(s => (
                  <a key={s} href="#" className="lp-social">{s}</a>
                ))}
              </div>
            </div>

            {[
              { head: 'Product', links: ['Features', 'Industries', 'Pricing', 'Updates'] },
              { head: 'Resources', links: ['Documentation', 'Tutorials', 'Blog', 'Support'] },
              { head: 'Company', links: ['About', 'Careers', 'Contact', 'Privacy'] },
            ].map(col => (
              <div className="lp-footer__col" key={col.head}>
                <h4>{col.head}</h4>
                {col.links.map(l => <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>)}
              </div>
            ))}
          </div>

          <div className="lp-footer__bottom">
            <p>© 2024 NexusAI. All rights reserved.</p>
            <p>Made with ♥ for the future of AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
