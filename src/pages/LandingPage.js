import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-70 z-0" />;
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
    <div className="relative min-h-screen bg-[#060612] text-[#e2e8f0] font-sans overflow-x-hidden">
      <ParticleCanvas />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 ${
        isScrolled ? 'bg-[#060612]/85 backdrop-blur-xl border-b border-white/10 shadow-lg' : ''
      }`}>
        <div className="max-w-7xl mx-auto flex items-center gap-8 h-[70px]">
          <button className="flex items-center gap-2.5 flex-shrink-0" onClick={() => navigate('/')}>
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]">🌌</span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-[#a78bfa] bg-clip-text text-transparent">
              NexusAI
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {['Features', 'Industries', 'Pricing'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-white hover:bg-white/10 transition"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            {currentUser ? (
              <>
                <span className="text-sm text-[#94a3b8] max-w-[200px] truncate">
                  👋 {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-white/10 border border-white/20 text-[#94a3b8] hover:text-white hover:bg-white/20 transition"
                >
                  Logout
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-lg shadow-[#8b5cf6]/40 hover:shadow-xl hover:shadow-[#8b5cf6]/60 hover:-translate-y-0.5 transition"
                >
                  Dashboard →
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-white/10 border border-white/20 text-[#94a3b8] hover:text-white hover:bg-white/20 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-lg shadow-[#8b5cf6]/40 hover:shadow-xl hover:shadow-[#8b5cf6]/60 hover:-translate-y-0.5 transition"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 ml-auto"
          >
            <span className={`block w-5 h-0.5 bg-[#94a3b8] transition ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#94a3b8] transition ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#94a3b8] transition ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-[#060612]/95 backdrop-blur-xl border-t border-white/10 overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}>
          <div className="flex flex-col gap-1 p-6">
            {['Features', 'Industries', 'Pricing'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="p-3 rounded-lg text-left text-[#94a3b8] hover:text-white hover:bg-white/10 transition"
              >
                {item}
              </button>
            ))}
            <hr className="border-white/10 my-2" />
            {currentUser ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-3 rounded-lg text-left text-[#94a3b8] hover:text-white hover:bg-white/10 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-lg text-left text-[#94a3b8] hover:text-white hover:bg-white/10 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="p-3 rounded-lg text-left text-[#94a3b8] hover:text-white hover:bg-white/10 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="p-3 rounded-lg text-left text-[#94a3b8] hover:text-white hover:bg-white/10 transition"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-36 overflow-hidden">
        {/* Orbs */}
        <div className="absolute w-[700px] h-[700px] -top-40 -left-40 bg-[#8b5cf6]/20 rounded-full blur-[90px] animate-float" />
        <div className="absolute w-[500px] h-[500px] -bottom-20 -right-20 bg-[#06b6d4]/15 rounded-full blur-[90px] animate-float animation-delay-2000" />
        <div className="absolute w-[300px] h-[300px] top-1/2 left-1/2 bg-[#f472b6]/15 rounded-full blur-[90px] animate-float animation-delay-4000" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Copy */}
          <div className="flex flex-col items-start lg:items-start text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#a78bfa] text-xs font-semibold tracking-wider uppercase mb-5 animate-pulse-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80] animate-pulse" />
              ✨ Next-Gen AI Platform — Now in Beta
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white mb-5">
              Intelligent Automation
              <br />
              <span className="bg-gradient-to-r from-[#a78bfa] via-[#06b6d4] to-[#f472b6] bg-clip-text text-transparent">
                For Every Industry
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-xl mb-9">
              Deploy custom AI models, gain real-time insights, and automate workflows
              across healthcare, finance, retail, manufacturing, and more — all from
              one enterprise-grade platform.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button
                onClick={() => navigate('/signup')}
                className="group relative px-7 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-lg shadow-[#8b5cf6]/40 hover:shadow-xl hover:shadow-[#8b5cf6]/60 hover:-translate-y-1 transition-all"
              >
                Start Free Trial
                <span className="inline-block ml-1 animate-spin-slow">✦</span>
              </button>
              <button
                onClick={() => scrollTo('features')}
                className="px-7 py-3.5 rounded-xl text-sm font-bold bg-transparent border border-[#8b5cf6]/50 text-[#a78bfa] hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10 hover:-translate-y-1 transition"
              >
                Explore Features →
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                { val: '99.9', suf: '%', label: 'Uptime SLA' },
                { val: '50', suf: '+', label: 'Industries' },
                { val: '10', suf: 'k+', label: 'Companies' },
                { val: '24', suf: '/7', label: 'AI Support' },
              ].map(({ val, suf, label }) => (
                <div key={label} className="text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/10 hover:-translate-y-1 transition">
                  <div className="text-2xl font-extrabold bg-gradient-to-r from-white to-[#a78bfa] bg-clip-text text-transparent">
                    <Counter target={val} suffix={suf} />
                  </div>
                  <div className="text-xs text-[#64748b] uppercase tracking-wider mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Mock - Hidden on mobile */}
          <div className="hidden lg:block relative animate-fade-up animation-delay-200">
            <div className="bg-[#0d0d20]/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 animate-float-slow">
              {/* Dashboard Top Bar */}
              <div className="flex items-center gap-2.5 px-4 py-3.5 bg-white/5 border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_8px_#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_8px_#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_8px_#28c840]" />
                <span className="text-xs text-[#64748b] font-medium ml-1">NexusAI Dashboard</span>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Metrics */}
                <div className="flex gap-2.5">
                  {[
                    { label: 'Accuracy', val: '94.2%', up: true },
                    { label: 'Processed', val: '1.2M', up: true },
                    { label: 'Latency', val: '8ms', up: false },
                  ].map((m) => (
                    <div key={m.label} className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-xs text-[#64748b] uppercase tracking-wider">{m.label}</div>
                      <div className="text-base font-bold text-white">{m.val}</div>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded w-fit ${
                        m.up ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
                      }`}>
                        {m.up ? '▲' : '▼'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="flex items-end gap-1.5 h-20 px-1">
                  {[55, 72, 48, 90, 68, 95, 80].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-full bg-gradient-to-t from-[#8b5cf6] to-[#6366f1]/30 rounded-t-sm shadow-[0_0_10px_rgba(139,92,246,0.3)] animate-bar-grow"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                      />
                      <span className="text-[0.6rem] text-[#64748b]">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* AI Feed */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[#94a3b8] w-fit animate-fade-up">
                    <span>🤖</span> Model training complete
                  </div>
                  <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[#94a3b8] w-fit animate-fade-up animation-delay-600">
                    <span>📊</span> Accuracy: 94.2% — Excellent
                  </div>
                  <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-[#8b5cf6]/30 to-[#6366f1]/20 border border-[#8b5cf6]/40 text-[#a78bfa] w-fit ml-auto animate-fade-up animation-delay-1000">
                    Deploy to production →
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Chips */}
            <div className="absolute top-[10%] -right-8 flex items-center gap-2 px-3 py-2 rounded-full bg-[#0d0d20]/90 backdrop-blur-xl border border-white/10 text-sm font-semibold shadow-xl animate-float animation-duration-3500">
              <span>🤖</span> ML Models
            </div>
            <div className="absolute top-[38%] -right-10 flex items-center gap-2 px-3 py-2 rounded-full bg-[#0d0d20]/90 backdrop-blur-xl border border-white/10 text-sm font-semibold shadow-xl animate-float animation-duration-4200">
              <span>📊</span> Analytics
            </div>
            <div className="absolute bottom-[22%] -left-8 flex items-center gap-2 px-3 py-2 rounded-full bg-[#0d0d20]/90 backdrop-blur-xl border border-white/10 text-sm font-semibold shadow-xl animate-float animation-duration-3800">
              <span>⚡</span> Automation
            </div>
            <div className="absolute bottom-[5%] -right-5 flex items-center gap-2 px-3 py-2 rounded-full bg-[#0d0d20]/90 backdrop-blur-xl border border-white/10 text-sm font-semibold shadow-xl animate-float animation-duration-4500">
              <span>🛡️</span> Security
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <button
          onClick={() => scrollTo('features')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-7 h-11 border-2 border-white/20 rounded-3xl flex justify-center pt-1.5 hover:border-[#8b5cf6] transition"
        >
          <div className="w-1 h-2 bg-white/40 rounded-full animate-scroll-wheel" />
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 bg-gradient-to-b from-transparent via-[#0d0d20]/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#a78bfa] text-xs font-semibold tracking-wider uppercase mb-5">
              🔥 Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Everything You Need to <span className="bg-gradient-to-r from-[#a78bfa] via-[#06b6d4] to-[#f472b6] bg-clip-text text-transparent">
                Succeed with AI
              </span>
            </h2>
            <p className="text-[#94a3b8] max-w-lg mx-auto">
              Designed for enterprises, adaptable for any industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:border-[#8b5cf6] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 transition"
                style={{ '--accent': f.color }}
              >
                <div className="absolute -top-14 -left-14 w-48 h-48 rounded-full bg-[#8b5cf6] opacity-5 group-hover:opacity-15 group-hover:scale-130 blur-3xl transition" />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-0 group-hover:opacity-100 transition" />
                
                <div className="text-4xl mb-4 group-hover:scale-110 group-hover:-rotate-5 transition drop-shadow-[0_0_12px_#8b5cf6]">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">{f.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed mb-5">{f.desc}</p>
                <ul className="flex flex-col gap-2">
                  {f.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-xs text-[#64748b]">
                      <span className="w-4 h-4 rounded-full bg-green-400/20 border border-green-400/30 flex items-center justify-center text-[0.6rem] text-green-400 font-bold flex-shrink-0">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="relative py-24 px-6 bg-[#0d0d20]/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Trusted Across <span className="bg-gradient-to-r from-[#a78bfa] via-[#06b6d4] to-[#f472b6] bg-clip-text text-transparent">
                Industries
              </span>
            </h2>
            <p className="text-[#94a3b8]">Custom AI solutions for every sector</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((ind) => (
              <div
                key={ind.name}
                className="group p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-[#8b5cf6]/20 transition"
              >
                <div className="text-3xl mb-3 group-hover:scale-120 group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] transition">
                  {ind.icon}
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{ind.name}</h4>
                <p className="text-xs text-[#64748b] leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute w-[600px] h-[600px] -top-24 -left-24 bg-[#8b5cf6]/20 rounded-full blur-[100px]" />
        <div className="absolute w-[400px] h-[400px] -bottom-24 -right-12 bg-[#06b6d4]/15 rounded-full blur-[100px]" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#94a3b8] text-xs font-semibold tracking-wider uppercase mb-5">
            🚀 Get Started Today
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Ready to Transform Your Business<br />
            <span className="bg-gradient-to-r from-[#a78bfa] via-[#06b6d4] to-[#f472b6] bg-clip-text text-transparent">
              with AI?
            </span>
          </h2>
          
          <p className="text-lg text-[#94a3b8] max-w-xl mx-auto mb-8">
            Join thousands of companies already using NexusAI to drive innovation and growth.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              onClick={() => navigate('/signup')}
              className="group relative px-9 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-lg shadow-[#8b5cf6]/40 hover:shadow-xl hover:shadow-[#8b5cf6]/60 hover:-translate-y-1 transition-all"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-9 py-4 rounded-xl text-base font-bold bg-transparent border border-[#8b5cf6]/50 text-[#a78bfa] hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10 hover:-translate-y-1 transition"
            >
              Schedule Demo
            </button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-sm text-[#64748b]">
            <span>✓ No credit card required</span>
            <span>✓ 14-day free trial</span>
            <span>✓ Full platform access</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#03030a] border-t border-white/10 pt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-2xl">🌌</span>
                <span className="text-xl font-extrabold bg-gradient-to-r from-white to-[#a78bfa] bg-clip-text text-transparent">
                  NexusAI
                </span>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed max-w-xs mb-4">
                Empowering businesses with intelligent AI solutions since 2024.
              </p>
              <div className="flex gap-2.5">
                {['𝕏', 'in', 'gh', '▶'].map(s => (
                  <a
                    key={s}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm text-[#94a3b8] hover:bg-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 hover:text-[#a78bfa] hover:-translate-y-1 transition"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {[
              { head: 'Product', links: ['Features', 'Industries', 'Pricing', 'Updates'] },
              { head: 'Resources', links: ['Documentation', 'Tutorials', 'Blog', 'Support'] },
              { head: 'Company', links: ['About', 'Careers', 'Contact', 'Privacy'] },
            ].map(col => (
              <div key={col.head}>
                <h4 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-4">
                  {col.head}
                </h4>
                <div className="flex flex-col gap-2.5">
                  {col.links.map(l => (
                    <a
                      key={l}
                      href={`#${l.toLowerCase()}`}
                      className="text-sm text-[#64748b] hover:text-white hover:translate-x-1 transition"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between py-5 text-xs text-[#64748b]">
            <p>© 2024 NexusAI. All rights reserved.</p>
            <p>Made with ♥ for the future of AI</p>
          </div>
        </div>
      </footer>

      {/* Add custom animations with style tag */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -20px) scale(1.05); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotateX(2deg); }
          50% { transform: translateY(-8px) rotateX(0deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bar-grow {
          from { height: 0; opacity: 0; }
          to { height: var(--h); opacity: 1; }
        }
        @keyframes scroll-wheel {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(14px); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(139,92,246,0); }
        }
        .animate-float { animation: float 8s ease-in-out infinite alternate; }
        .animate-float-slow { animation: float-slow 5s ease-in-out infinite alternate; }
        .animate-fade-up { animation: fade-up 0.8s ease both; }
        .animate-bar-grow { animation: bar-grow 1s ease both; }
        .animate-scroll-wheel { animation: scroll-wheel 1.8s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-duration-3500 { animation-duration: 3.5s; }
        .animation-duration-3800 { animation-duration: 3.8s; }
        .animation-duration-4200 { animation-duration: 4.2s; }
        .animation-duration-4500 { animation-duration: 4.5s; }
      `}</style>
    </div>
  );
};

export default LandingPage;