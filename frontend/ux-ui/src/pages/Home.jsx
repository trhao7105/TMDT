import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-surface font-body text-on-surface">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,31,42,0.06)] h-20 flex items-center">
        <div className="flex justify-between items-center px-8 w-full max-w-7xl mx-auto font-['Manrope'] tracking-tight">
          <div className="text-2xl font-bold text-[#00113a] dark:text-[#00e3fd]">iClocker</div>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-[#00113a] dark:text-[#00e3fd] font-bold border-b-2 border-[#006875] pb-1 hover:text-[#006875] transition-colors duration-300" to="/">Home</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/services">Services</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/order">Order</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/support">Support</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2 rounded-full font-semibold text-[#00113a] hover:bg-surface-container-low transition-all active:scale-95">Login</Link>
            <Link to="/signup" className="px-6 py-2 rounded-full font-semibold text-[#00113a] hover:bg-surface-container-low transition-all active:scale-95">
                Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center px-8 py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container/20 text-secondary mb-6">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse mr-2"></span>
                <span className="text-sm font-bold tracking-wide">SMART STORAGE NOW LIVE</span>
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] mb-8 tracking-tight">
                The Digital <span className="text-secondary">Concierge</span> for Your Belongings.
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                Experience industrial-grade security at our central warehouse. Smart locker rentals managed entirely from your phone. Simple, safe, and available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-primary text-on-primary rounded-full text-lg font-bold shadow-xl hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center group">
                  Rent a Locker
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button className="px-8 py-4 bg-surface-container-lowest text-primary rounded-full text-lg font-bold border border-outline-variant/30 hover:bg-surface-container-low transition-all flex items-center justify-center">
                  View Locations
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                <img 
                  alt="Modern blue smart lockers" 
                  className="w-full h-[500px] object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtYJEpXpYZlsnNeHAL8UBjwfsctS388y1vlkKPbrHROY1i28xMUgf06xQOqfm7fzMu9eedfEBkANYrk546ks9jLIteJiK27cDIdXeVuNEvqBpBvTFXLL2LB9IPCnNgPw89A2s14eOVRBrDgARK01uO1ckH3ArtN8yI0qHpmbrlt5CYCDvrjMubSLD_fjLiie6DU5vcd-khHROmM6HRqJRaqlzTLLit7le8hq2nAngWBYBkaJLmCPpqMwtjZwthsAtGyVfSyjrjCx8" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                {/* Floating Live Status Card */}
                <div className="absolute bottom-6 left-6 right-6 p-6 backdrop-blur-xl bg-white/80 rounded-xl shadow-lg border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-headline font-bold text-primary">Warehouse A-42</span>
                    <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-black">ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-secondary-container">
                      <span className="material-symbols-outlined">lock_open</span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium">Current Status</p>
                      <p className="text-sm font-bold text-primary">Ready for check-in</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">Built on Architectural Trust</h2>
              <p className="text-on-surface-variant">We combine physical fortitude với digital intelligence to provide the world's most reliable storage solution.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-3xl">schedule</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-primary mb-4">24/7 Autonomous Access</h3>
                <p className="text-on-surface-variant leading-relaxed">No reception desks, no waiting. Access your items at any time through our automated warehouse systems.</p>
              </div>
              <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-secondary text-white rounded-xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-primary mb-4">Military-Grade Security</h3>
                <p className="text-on-surface-variant leading-relaxed">Encrypted digital keys and multi-factor biometric authentication keep your belongings behind iron-clad protection.</p>
              </div>
              <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-container text-white rounded-xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-3xl">warehouse</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-primary mb-4">Centralized Warehousing</h3>
                <p className="text-on-surface-variant leading-relaxed">Our climate-controlled facilities ensure that everything from electronics to fine art stays in pristine condition.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
              <div className="md:col-span-8 bg-primary rounded-2xl p-12 flex flex-col justify-between text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00113a 0%, #002366 100%)' }}>
                <div className="relative z-10">
                  <h3 className="text-4xl font-headline font-extrabold mb-4">Total Control <br />in Your Pocket</h3>
                  <p className="text-primary-fixed-dim max-w-sm mb-8">Lock, unlock, and share access with friends or delivery services instantly from our app.</p>
                  <button className="px-6 py-3 bg-secondary text-white rounded-full font-bold hover:brightness-110 transition-all flex items-center gap-2">
                    Download App
                    <span className="material-symbols-outlined">install_mobile</span>
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                  <img alt="Tech pattern" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF2uMyueQnkrxvRmup4BhHdYWW9bngdD3l-3mJApTbrRzeyAaLOXzWyrWNEeU4YYwGqUChXStVZCk4uZlDCHWC_yhGARPCh-39ac2SpH0Oi7LaI5CS1UZRa_smAJ9lW1wQl6a8IDEG-srpQLgG0NnPibL8SzGeL43fOFsC935PwijthdxR-WgRA2HkApA-l0AO4IRtFZmuK9sltv1ooCAs6dtFMmwdBs9Zwz6-uMwMF2DOH3yWmLqY1yTRBmXLpaQS_2w3QD6OOZw" />
                </div>
              </div>
              <div className="md:col-span-4 bg-secondary-container rounded-2xl p-12 flex flex-col justify-end text-on-secondary-container">
                <span className="material-symbols-outlined text-5xl mb-6">nest_remote_comfort_sensor</span>
                <h3 className="text-2xl font-headline font-bold mb-2">Climate Smart</h3>
                <p className="text-sm opacity-80">Precision environmental controls keeping 68°F and 45% humidity across all locker units.</p>
              </div>
              <div className="md:col-span-4 bg-surface-container-high rounded-2xl p-12 flex flex-col justify-between">
                <div className="flex -space-x-3">
                  {[300, 400, 500].map((bg, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-${bg}`}></div>
                  ))}
                </div>
                <div>
                  <h3 className="text-xl font-headline font-bold text-primary">Trusted by 50k+ Users</h3>
                  <p className="text-sm text-on-surface-variant">Global travelers and local businesses trust iClocker every day.</p>
                </div>
              </div>
              <div className="md:col-span-8 bg-surface-container-low rounded-2xl p-12 flex items-center gap-8 overflow-hidden">
                <div className="flex-1">
                  <h3 className="text-2xl font-headline font-bold text-primary mb-2">Instant Scale</h3>
                  <p className="text-sm text-on-surface-variant">Need more space? Upgrade your locker size in seconds without moving your items.</p>
                </div>
                <div className="w-48 h-full bg-primary-container rounded-xl flex items-center justify-center -rotate-12 translate-y-8 translate-x-8">
                  <span className="material-symbols-outlined text-6xl text-secondary-container">add_box</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-5xl mx-auto bg-primary-container rounded-2xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-8 relative z-10">Secure Your Space Today</h2>
            <p className="text-primary-fixed-dim text-lg mb-12 max-w-2xl mx-auto relative z-10">
              No long-term commitments. Flexible daily, weekly, and monthly rates starting from just $1.50/day.
            </p>
            <div className="flex justify-center relative z-10">
              <button className="px-12 py-5 bg-secondary-container text-on-secondary-container rounded-full text-xl font-black shadow-2xl hover:scale-105 transition-transform active:scale-95">
                Start Your Rental
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f4faff] dark:bg-[#00113a] w-full py-12">
        <div className="max-w-7xl mx-auto px-8 border-t border-slate-200 dark:border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="text-lg font-black text-[#00113a] dark:text-white mb-2">iClocker</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">© 2024 iClocker. Secured by Architectural Layering.</p>
          </div>
          <div className="flex gap-8 text-sm">
            {['Privacy', 'Terms', 'Cookies', 'Contact'].map((item) => (
              <a key={item} className="text-slate-500 dark:text-slate-400 hover:text-[#006875] hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
