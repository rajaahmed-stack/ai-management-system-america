import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Mail,
  HelpCircle,
  ShieldCheck,
  Globe
} from 'lucide-react';

const OrganizationLogin = () => {
  const [formData, setFormData] = useState({
    organizationId: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { loginWithOrganization } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await loginWithOrganization(formData.organizationId, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid Organization ID or Password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      organizationId: 'ORG_DEMO123',
      password: 'demopassword123',
      rememberMe: false
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] font-sans selection:bg-emerald-500/30">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm" 
          />
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -180, -360],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full border border-emerald-500/10 bg-emerald-500/5 backdrop-blur-sm" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] right-[10%] w-24 h-24 rounded-full border border-blue-500/10 bg-blue-500/5 backdrop-blur-sm" 
          />
        </div>

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[520px] px-6 py-12"
      >
        {/* Glass Card */}
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          {/* Animated Top Border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          {/* Header Section */}
          <div className="mb-10 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-3 mb-8 cursor-pointer group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/40">
                  <Globe className="h-7 w-7 text-white animate-pulse" />
                </div>
              </div>
              <div className="text-left">
                <span className="block text-2xl font-bold tracking-tighter text-white leading-none">Nexus<span className="text-emerald-500">AI</span></span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Enterprise Portal</span>
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Organization Login</h1>
            <p className="text-white/40 text-sm font-medium">Secure gateway for authorized personnel only</p>
          </div>

          {/* Demo Credentials Banner */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.12)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDemoLogin}
            className="w-full mb-8 flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-left transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="h-12 w-12 text-emerald-500" />
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-500 mb-1">System Access</p>
              <p className="text-sm font-medium text-white/80">Auto-fill demo credentials</p>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-500/40 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </motion.button>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 flex items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-400 shadow-lg"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold leading-snug">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">Organization ID</label>
                <span className="text-[10px] text-white/20 font-mono">REQUIRED</span>
              </div>
              <div className="relative group">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <input
                  type="text"
                  name="organizationId"
                  value={formData.organizationId}
                  onChange={handleChange}
                  required
                  placeholder="ORG-XXXX-XXXX"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4.5 pl-14 pr-5 text-white placeholder:text-white/10 outline-none ring-emerald-500/10 transition-all duration-300 focus:border-emerald-500/40 focus:bg-white/[0.07] focus:ring-8"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">Security Key</label>
                <span className="text-[10px] text-white/20 font-mono">ENCRYPTED</span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4.5 pl-14 pr-14 text-white placeholder:text-white/10 outline-none ring-emerald-500/10 transition-all duration-300 focus:border-emerald-500/40 focus:bg-white/[0.07] focus:ring-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 pt-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-6 rounded-lg border-2 border-white/10 bg-white/5 transition-all duration-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/20" />
                  <div className="absolute h-4 w-4 scale-0 text-emerald-500 transition-transform duration-300 peer-checked:scale-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-white/40 group-hover:text-white/70 transition-colors">Trust this device</span>
              </label>
              <Link to="/forgot" className="text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors tracking-tight">
                Recovery Access
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-2xl bg-emerald-500 py-5 font-black text-black transition-all hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    <span className="uppercase tracking-widest">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest">Access Dashboard</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Footer Assistance */}
          <div className="mt-12 pt-8 border-t border-white/5 space-y-8">
            <div className="flex items-start gap-5 rounded-[24px] bg-white/[0.02] border border-white/5 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-inner">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1">Credential Support</p>
                <p className="text-xs text-white/30 leading-relaxed font-medium">Organization IDs are issued by your administrator. Check your secure onboarding documentation.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black"><span className="bg-[#0c0c0c] px-6 text-white/20">Switch Protocol</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link to="/login" className="flex items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 py-4 text-xs font-bold uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all group">
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Personal</span>
              </Link>
              <Link to="/signup" className="flex items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 py-4 text-xs font-bold uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all group">
                <Building2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>New Org</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Legal/Version Info */}
        <div className="mt-8 flex justify-between items-center px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/10">
          <span>v2.4.0-STABLE</span>
          <span>© 2026 NEXUSAI CORP</span>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizationLogin;