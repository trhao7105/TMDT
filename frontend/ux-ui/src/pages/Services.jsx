import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="bg-surface font-body text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,31,42,0.06)] h-20">
        <div className="flex justify-between items-center px-8 h-full max-w-7xl mx-auto font-['Manrope'] tracking-tight">
          <div className="text-2xl font-bold text-[#00113a]">iClocker</div>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-slate-600 font-medium hover:text-[#006875] transition-colors duration-300" to="/">Home</Link>
            <Link className="text-[#00113a] font-bold border-b-2 border-[#006875] pb-1 hover:text-[#006875] transition-colors duration-300" to="/services">Services</Link>
            <Link className="text-slate-600 font-medium hover:text-[#006875] transition-colors duration-300" to="/order">Order</Link>
            <Link className="text-slate-600 font-medium hover:text-[#006875] transition-colors duration-300" to="/support">Support</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2 rounded-full font-semibold text-[#00113a] hover:bg-surface-container-low transition-all active:scale-95">Login</Link>
            <Link to="/signup" className="px-6 py-2 rounded-full font-semibold text-[#00113a] hover:bg-surface-container-low transition-all active:scale-95">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="mb-20">
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-primary tracking-tight mb-6 max-w-3xl">
            Premium Care for Your <br />
            <span className="text-secondary">Valuables.</span>
          </h1>
          <p className="text-on-surface-variant text-xl max-w-xl font-body leading-relaxed">
            Experience world-class security combined with high-end amenities at our Central Warehouse. We don't just store; we care.
          </p>
        </header>

        {/* Bento Grid Services Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Hero Image Card */}
          <div className="md:col-span-8 h-[400px] rounded-xl overflow-hidden relative group">
            <img
              alt="Central Warehouse"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-alt="Modern minimalist warehouse interior with architectural lighting, high ceilings, and sleek metal locker structures in deep navy."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe5f7XdiiKbKC9Jvq0yyQgqywgwH1OKV3WKjApgJXUuDleEvPLtkz7v7LEsw3odVDQohPt9_TQ3Gthe3qplAGbriuoIoWDu7R1M6ToamFOUxO3oiCYa9lBGGwSacmQX8fSy_ZoxoP617M_yNTvf4WONawws8Drw_IfS5_2REGVc4scFWfOOq7uLrOzfekoWQyqP7JC-rB-v35T7bYiRPIOKL1lDPKxgx0eMztJ8SAIYtKnvIBL_cE2gZG5iP1GnvIUEvC8OXdjqxE"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-10">
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold w-fit mb-4">PRIMARY HUB</span>
              <h2 className="text-white font-headline text-3xl font-bold">The Central Warehouse</h2>
              <p className="text-white/80 max-w-md mt-2">Strategically located for maximum accessibility and ironclad security.</p>
            </div>
          </div>

          {/* Member Lounge Card */}
          <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between transition-all hover:bg-surface-container-high group">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl" data-icon="coffee">coffee</span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-primary mb-3">Member lounge</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Relax in our climate-controlled environment while our staff handles your storage needs. Premium seating and refreshments available.
              </p>
            </div>
          </div>

          {/* High-speed Wi-Fi Card */}
          <div className="md:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col items-center text-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl" data-icon="wifi">wifi</span>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl text-secondary-container" data-icon="wifi">wifi</span>
            </div>
            <h3 className="font-headline text-2xl font-bold mb-2">High-speed Wi-Fi</h3>
            <p className="text-white/70 text-sm">Fiber-optic connectivity across the entire warehouse floor for seamless inventory management.</p>
          </div>

          {/* Loading Bay Card */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_24px_rgba(0,31,42,0.04)] border border-outline-variant/15 hover:border-secondary transition-colors">
            <div className="w-full md:w-1/2 h-48 rounded-lg overflow-hidden">
              <img
                alt="Loading Bay"
                className="w-full h-full object-cover"
                data-alt="Professional logistics loading dock at dusk with blue industrial lights and clean concrete floors."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf4mgckYROeoNy0id43DoVLaR4JU-vnb2Q9aYLEQyx4v8vp5gNMrKU8e7_Pxm2ne-Pi-h292tUZJcoqOJ0KwrUn3dHw1yK6bjBQRQFhBHdmzKtNHbqdZq5gWxG2Tras27XJeAl9_GrrBqc8TKscwOPjzHgtsgjX7jeW_VK7Un0gUuKyL9W79lNadKiT43J83VFwaEQCaiXpyIZGx2VpQ4NLg9NcjQoUHo2NrW4Ypam_-001SRDpB20jJpR7-JQSQaznpuHKsQOCFk"
              />
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-secondary" data-icon="local_shipping">local_shipping</span>
                <h3 className="font-headline text-2xl font-bold text-primary">Loading bay</h3>
              </div>
              <p className="text-on-surface-variant text-sm mb-6">
                Dedicated zones for quick drop-offs and large-scale cargo intake. Equipped with automated lifts and security clearance sensors.
              </p>
              <button className="flex items-center gap-2 text-secondary font-bold text-sm hover:underline">
                Learn about logistics
                <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-20 py-16 px-10 bg-primary-container rounded-xl flex flex-wrap justify-between items-center gap-8 text-white">
          <div className="flex-1 min-w-[200px]">
            <div className="font-headline text-5xl font-extrabold mb-1">24/7</div>
            <div className="text-on-primary-container font-medium uppercase tracking-widest text-xs">Security Access</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-headline text-5xl font-extrabold mb-1">0%</div>
            <div className="text-on-primary-container font-medium uppercase tracking-widest text-xs">Incident Rate</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-headline text-5xl font-extrabold mb-1">99+</div>
            <div className="text-on-primary-container font-medium uppercase tracking-widest text-xs">Service Points</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-headline text-5xl font-extrabold mb-1">10GB</div>
            <div className="text-on-primary-container font-medium uppercase tracking-widest text-xs">Wi-Fi Speed</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-[#f4faff] border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-black text-[#00113a]">iClocker</span>
            <p className="text-slate-500 font-['Inter'] text-sm mt-1">© 2024 iClocker. Secured by Architectural Layering.</p>
          </div>
          <div className="flex space-x-8">
            <a className="text-slate-500 text-sm font-['Inter'] hover:underline hover:text-[#006875] transition-opacity" href="#">Privacy</a>
            <a className="text-slate-500 text-sm font-['Inter'] hover:underline hover:text-[#006875] transition-opacity" href="#">Terms</a>
            <a className="text-slate-500 text-sm font-['Inter'] hover:underline hover:text-[#006875] transition-opacity" href="#">Cookies</a>
            <a className="text-slate-500 text-sm font-['Inter'] hover:underline hover:text-[#006875] transition-opacity" href="#">Contact</a>
          </div>
          <div className="flex space-x-4">
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors" data-icon="share">share</span>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors" data-icon="public">public</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;
