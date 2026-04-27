import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('access_token', response.data.access_token);
      alert('Đăng nhập thành công!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Sai tài khoản hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden">
      {/* Split Screen Layout */}
      <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side: Interactive Branding & Visuals (Hidden on Mobile) */}
      <section className="hidden lg:flex flex-col justify-between p-12 bg-primary-container relative overflow-hidden">
        {/* Decorative Architectural Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-secondary-container rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-primary-fixed-dim rounded-full blur-[100px]"></div>
        </div>
        
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            </div>
            <span className="text-2xl font-bold font-headline tracking-tight text-white">iClocker</span>
          </Link>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold font-headline text-white leading-tight mb-6">
            Securing your world, <br/>
            <span className="text-secondary-container">one lock at a time.</span>
          </h1>
          <p className="text-primary-fixed-dim text-lg leading-relaxed mb-10">
            Access your premium locker network with architectural-grade security and effortless digital management.
          </p>
          
          {/* Floating Feature Card */}
          <div className="glass-morphism rounded-xl p-6 border border-white/10 shadow-2xl flex items-start gap-4" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(24px)' }}>
            <div className="p-3 bg-secondary-container/20 rounded-lg">
              <span className="material-symbols-outlined text-secondary-container">verified_user</span>
            </div>
            <div>
              <p className="text-primary font-bold font-headline">Smart Access Granted</p>
              <p className="text-on-surface-variant text-sm">Securely managing 1.2M active lockers worldwide with sub-second latency.</p>
            </div>
          </div>
        </div>
        
        {/* Footer Branding */}
        <div className="relative z-10">
          <p className="text-primary-fixed-dim/60 text-xs font-medium tracking-widest uppercase">Precision Security Systems</p>
        </div>
      </section>
      
      {/* Right Side: Login Form */}
      <section className="flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-surface-container-lowest">
        <div className="w-full max-w-md">
          {/* Mobile Branding (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
              <span className="text-xl font-bold font-headline tracking-tight text-primary">iClocker</span>
            </Link>
          </div>
          
          <header className="mb-10">
            <h2 className="text-3xl font-extrabold font-headline text-primary mb-2">Welcome Back</h2>
            <p className="text-on-surface-variant font-medium">Log in to manage your digital concierge assets.</p>
          </header>
          
          {/* Social Login Cluster */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low rounded-xl border border-outline-variant/15 hover:bg-surface-container-high transition-colors group">
              <img alt="Google Logo" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW0le8Z-Fpc55L4gYCoWkjAwz00bnSd6x1Hj7SM5zoaek4JU1RAXV_WqIMQunkq7e-e9muLJ06x-I4S7b09H_9QLrfa0mEUfUqiokmiLARFl-2u6pSKjQo3-AGpWwNIe3mc6-CSCOdZ_AvfwBLVhQO9Bi_qeVJQmhzpRDyCNpCD1bCaL7nZEdl5MuWyRFdBNAMjHPzNF5DRB_Z90LWdOUBGdqhDWzpUAr5Rp5HDUjIM3w7-us4E8HRC04nEMY_MqwoqMlNQLdGro0"/>
              <span className="text-sm font-semibold text-on-surface-variant">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low rounded-xl border border-outline-variant/15 hover:bg-surface-container-high transition-colors group">
              <span className="material-symbols-outlined text-xl text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>ios</span>
              <span className="text-sm font-semibold text-on-surface-variant">Apple</span>
            </button>
          </div>
          
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-outline-variant/20"></div>
            <span className="px-4 text-xs font-bold text-outline uppercase tracking-widest">or continue with email</span>
            <div className="flex-grow border-t border-outline-variant/20"></div>
          </div>
          
          {/* Main Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm font-semibold">{error}</div>}
            <div>
              <label className="block text-sm font-bold text-primary mb-2 ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl">mail</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface focus:ring-2 focus:ring-secondary focus:bg-white transition-all placeholder:text-outline/60" id="email" placeholder="name@company.com" type="email" value={formData.email} onChange={handleChange} required/>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-sm font-bold text-primary" htmlFor="password">Password</label>
                <a className="text-xs font-bold text-secondary hover:text-on-secondary-container transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl">lock</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface focus:ring-2 focus:ring-secondary focus:bg-white transition-all placeholder:text-outline/60" id="password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} required/>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-primary" type="button">visibility</button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-2">
              <input className="w-5 h-5 rounded-md border-outline-variant bg-surface-container-high text-primary focus:ring-primary" id="remember" type="checkbox"/>
              <label className="text-sm text-on-surface-variant font-medium" htmlFor="remember">Keep me logged in for 30 days</label>
            </div>
            
            <button disabled={loading} className="w-full py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/10 hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50" type="submit">
              <span>{loading ? 'Processing...' : 'Sign In'}</span>
              {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
            </button>
          </form>
          
          <footer className="mt-12 text-center">
            <p className="text-on-surface-variant font-medium">
              New to iClocker? 
              <Link className="text-secondary font-bold ml-1 hover:underline decoration-2 underline-offset-4" to="/signup">Create an account</Link>
            </p>
          </footer>
        </div>
      </section>
      </main>
      
      {/* Global Footer Shared Component */}
      <footer className="w-full py-12 bg-[#f4faff] dark:bg-[#00113a] border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
          <div className="mb-6 md:mb-0">
            <span className="text-lg font-black text-[#00113a] dark:text-white">iClocker</span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] mt-1">© 2024 iClocker. Secured by Architectural Layering.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Privacy</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Terms</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Cookies</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
