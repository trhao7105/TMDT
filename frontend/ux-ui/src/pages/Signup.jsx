import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/signup', {
        full_name: formData.name,
        email: formData.email,
        password: formData.password
      });
      alert('Đăng ký thành công! Vui lòng kiểm tra Email (hoặc Terminal) để kích hoạt tài khoản.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Thất bại khi đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-container/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-primary-container/5 blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,31,42,0.06)] overflow-hidden relative z-10">
          <div className="hidden lg:flex flex-col justify-between p-12 text-white" style={{ background: 'linear-gradient(135deg, #00113a 0%, #002366 100%)' }}>
            <div>
              <Link to="/">
                <h1 className="font-headline font-extrabold text-3xl tracking-tight text-secondary-container mb-6 hover:opacity-80 transition-opacity">iClocker</h1>
              </Link>
              <h2 className="font-headline font-bold text-4xl leading-tight mb-8">Secure your space,<br/>liberate your journey.</h2>
              <p className="text-on-primary-container text-lg leading-relaxed max-w-sm">Experience the gold standard in smart storage. Architectural security meets digital convenience.</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-container">shield</span>
                </div>
                <div>
                  <p className="font-semibold">Military Grade Encryption</p>
                  <p className="text-on-primary-container text-sm">Your data and belongings are locked with intent.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-container">schedule</span>
                </div>
                <div>
                  <p className="font-semibold">24/7 Smart Access</p>
                  <p className="text-on-primary-container text-sm">Automated systems at your service anytime.</p>
                </div>
              </div>
            </div>
            <div className="mt-12 opacity-40">
              <img alt="clean geometric pattern of interconnected lines and dots representing a secure network in navy and cyan tones" className="w-full h-32 object-cover rounded-lg mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUfPXUOTSiXprY5LcHPbvKQrgeEAaCOrDqWuqMzT7y2TSsFgPBfBytsKx65xpSzyR68s9vQe-1T8qaxCcmsI2gTyl_rynRxfSsGqg8d7eLPWjI5ycg57OJPnaWzRc312ZUZQipJ40EkrAJwcENTPjEB18NU6eztJqjhDZWQYTgmr11YZPoy9i2c51LATaLitIB7gi6YMVgkf_S0sNZtehs6MEKKSwuPCAWrI1EgepaNwjs8hv1xLCjYsybiqZt22evxyiKVrC3JE"/>
            </div>
          </div>
          
          <div className="p-8 lg:p-16 flex flex-col justify-center">
            {/* Mobile Branding */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <span className="text-xl font-bold font-headline tracking-tight text-primary">iClocker</span>
              </Link>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h3 className="font-headline font-extrabold text-3xl text-primary tracking-tight mb-2">Create Account</h3>
              <p className="text-on-surface-variant">Join the elite network of smart storage users.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm font-semibold">{error}</div>}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 px-1" htmlFor="name">Full Name</label>
                <div className="relative">
                  <input className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-secondary transition-all placeholder:text-slate-400" id="name" placeholder="John Doe" type="text" value={formData.name} onChange={handleChange} required/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 px-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-secondary transition-all placeholder:text-slate-400" id="email" placeholder="name@company.com" type="email" value={formData.email} onChange={handleChange} required/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 px-1" htmlFor="password">Password</label>
                <div className="relative">
                  <input className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-secondary transition-all placeholder:text-slate-400" id="password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} required/>
                </div>
              </div>
              <div className="flex items-start gap-3 px-1 py-2">
                <div className="flex items-center h-5">
                  <input className="w-5 h-5 rounded border-none bg-surface-container-highest text-secondary focus:ring-secondary" id="terms" type="checkbox"/>
                </div>
                <label className="text-sm text-on-surface-variant leading-relaxed" htmlFor="terms">
                  I agree to the <a className="text-secondary font-semibold hover:underline" href="#">Terms of Service</a> and <a className="text-secondary font-semibold hover:underline" href="#">Privacy Policy</a>.
                </label>
              </div>
              <div className="pt-4">
                <button disabled={loading} className="w-full py-4 px-6 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:bg-primary-container transition-all active:scale-[0.98] relative overflow-hidden group disabled:opacity-50" type="submit">
                  <span className="relative z-10">{loading ? 'Processing...' : 'Create Account'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </div>
            </form>
            <div className="mt-12 pt-8 border-t border-surface-container-low text-center">
              <p className="text-on-surface-variant">
                Already have an account? 
                <Link className="text-secondary font-bold hover:text-on-secondary-container transition-colors ml-1" to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-12 flex flex-col md:flex-row justify-between items-center px-8 border-t border-slate-200 dark:border-slate-800 bg-[#f4faff] dark:bg-[#00113a]">
        <div className="mb-4 md:mb-0">
          <span className="text-lg font-black text-[#00113a] dark:text-white">iClocker</span>
        </div>
        <p className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-0">© 2024 iClocker. Secured by Architectural Layering.</p>
        <div className="flex gap-6">
          <a className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Privacy</a>
          <a className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Terms</a>
          <a className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Cookies</a>
          <a className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
