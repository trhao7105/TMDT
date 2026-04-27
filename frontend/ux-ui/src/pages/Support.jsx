import React from 'react';
import { Link } from 'react-router-dom';

const Support = () => {
  return (
    <div className="bg-surface font-body text-on-surface">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#00113a]/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,31,42,0.06)]">
        <nav className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto font-['Manrope'] tracking-tight">
          <div className="text-2xl font-bold text-[#00113a] dark:text-[#00e3fd]">iClocker</div>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/">Home</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/services">Services</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/order">Order</Link>
            <Link className="text-[#00113a] dark:text-[#00e3fd] font-bold border-b-2 border-[#006875] pb-1" to="/support">Support</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2 rounded-full font-semibold text-[#00113a] hover:bg-surface-container-low transition-all active:scale-95">Login</Link>
            <Link to="/signup" className="px-6 py-2 rounded-full font-semibold text-[#00113a] hover:bg-surface-container-low transition-all active:scale-95">
              Sign Up
            </Link>
            <span className="material-symbols-outlined text-slate-600 cursor-pointer" data-icon="logout">logout</span>
          </div>
        </nav>
      </header>
      
      <main className="pt-32 pb-24">
        {/* Hero Section & Search */}
        <section className="max-w-7xl mx-auto px-8 mb-20 text-center">
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-primary mb-6">How can we help?</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-10 leading-relaxed">Search for answers about locker bookings, payments, and our smart security protocols.</p>
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-surface-container-lowest rounded-xl shadow-lg px-6 py-4 border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary-container mr-4" data-icon="search">search</span>
              <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder-slate-400 text-lg" placeholder="Search keywords like 'booking', 'PIN code', 'refund'..." type="text"/>
            </div>
          </div>
        </section>

        {/* Category Bento Grid */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Booking Category */}
            <div className="group bg-surface-container-low p-8 rounded-xl hover:bg-primary transition-all duration-500 cursor-pointer overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-secondary-container rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary-fixed transition-colors">
                  <span className="material-symbols-outlined text-on-secondary-container" data-icon="calendar_month">calendar_month</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary group-hover:text-white mb-4">Booking</h3>
                <p className="text-on-surface-variant group-hover:text-slate-300">Reserve, modify, or extend your locker rental with ease.</p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-primary-container/10 text-9xl transition-transform group-hover:scale-110" data-icon="calendar_month">calendar_month</span>
            </div>
            
            {/* Payment Category */}
            <div className="group bg-surface-container-low p-8 rounded-xl hover:bg-primary transition-all duration-500 cursor-pointer overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-secondary-container rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary-fixed transition-colors">
                  <span className="material-symbols-outlined text-on-secondary-container" data-icon="payments">payments</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary group-hover:text-white mb-4">Payment</h3>
                <p className="text-on-surface-variant group-hover:text-slate-300">Billing history, refund policies, and secure checkout methods.</p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-primary-container/10 text-9xl transition-transform group-hover:scale-110" data-icon="payments">payments</span>
            </div>
            
            {/* Security Category */}
            <div className="group bg-surface-container-low p-8 rounded-xl hover:bg-primary transition-all duration-500 cursor-pointer overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-secondary-container rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary-fixed transition-colors">
                  <span className="material-symbols-outlined text-on-secondary-container" data-icon="shield">shield</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary group-hover:text-white mb-4">Security</h3>
                <p className="text-on-surface-variant group-hover:text-slate-300">Encryption standards and locker hardware safety protocols.</p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-primary-container/10 text-9xl transition-transform group-hover:scale-110" data-icon="shield">shield</span>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="max-w-4xl mx-auto px-8 mb-32">
          <h2 className="font-headline text-3xl font-extrabold text-primary mb-12 flex items-center">
            <span className="w-8 h-1 bg-secondary inline-block mr-4 rounded-full"></span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <button className="w-full text-left px-8 py-6 flex justify-between items-center group">
                <span className="font-headline font-bold text-primary text-lg">How do I access my locker once booked?</span>
                <span className="material-symbols-outlined text-secondary transition-transform group-hover:translate-y-0.5" data-icon="expand_more">expand_more</span>
              </button>
              <div className="px-8 pb-6 text-on-surface-variant leading-relaxed">
                After completing your booking, you will receive a unique digital access code via the app and email. Simply enter this code on the locker's digital interface to unlock your assigned compartment.
              </div>
            </div>
            {/* FAQ Item 2 */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <button className="w-full text-left px-8 py-6 flex justify-between items-center group">
                <span className="font-headline font-bold text-primary text-lg">What happens if I forget my access code?</span>
                <span className="material-symbols-outlined text-secondary transition-transform group-hover:translate-y-0.5" data-icon="expand_more">expand_more</span>
              </button>
              <div className="px-8 pb-6 text-on-surface-variant leading-relaxed">
                No worries! You can retrieve your code anytime in the "My Orders" section of the iClocker app. For immediate assistance, use the 'Help' button at any physical kiosk location.
              </div>
            </div>
            {/* FAQ Item 3 */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <button className="w-full text-left px-8 py-6 flex justify-between items-center group">
                <span className="font-headline font-bold text-primary text-lg">Can I extend my rental period remotely?</span>
                <span className="material-symbols-outlined text-secondary transition-transform group-hover:translate-y-0.5" data-icon="expand_more">expand_more</span>
              </button>
              <div className="px-8 pb-6 text-on-surface-variant leading-relaxed">
                Yes, you can extend your rental directly through the iClocker app up to 30 minutes before your current booking expires, provided there is availability for that compartment.
              </div>
            </div>
            {/* FAQ Item 4 */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <button className="w-full text-left px-8 py-6 flex justify-between items-center group">
                <span className="font-headline font-bold text-primary text-lg">Are my items insured?</span>
                <span className="material-symbols-outlined text-secondary transition-transform group-hover:translate-y-0.5" data-icon="expand_more">expand_more</span>
              </button>
              <div className="px-8 pb-6 text-on-surface-variant leading-relaxed">
                Every iClocker booking includes standard architectural layering protection. We also offer premium insurance coverage for high-value items which can be added during the checkout process.
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="max-w-7xl mx-auto px-8">
          <div className="bg-primary rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xl">
            <div className="md:w-1/3 p-12 bg-primary-container text-white flex flex-col justify-between">
              <div>
                <h2 className="font-headline text-3xl font-extrabold mb-6">Need human help?</h2>
                <p className="text-on-primary-container text-lg mb-8 leading-relaxed">Our concierge team is available 24/7 to ensure your storage experience is flawless.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary-container" data-icon="mail">mail</span>
                  <span>support@iclocker.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary-container" data-icon="call">call</span>
                  <span>+1 (555) 012-3456</span>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 p-12 bg-white">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Full Name</label>
                  <input className="w-full px-6 py-4 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-secondary text-primary transition-all" placeholder="John Doe" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Email Address</label>
                  <input className="w-full px-6 py-4 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-secondary text-primary transition-all" placeholder="john@example.com" type="email"/>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">How can we help?</label>
                  <textarea className="w-full px-6 py-4 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-secondary text-primary transition-all" placeholder="Describe your issue in detail..." rows="4"></textarea>
                </div>
                <div className="md:col-span-2 text-right">
                  <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold active:scale-95 transition-all shadow-md hover:bg-primary-container" type="submit">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f4faff] dark:bg-[#00113a] w-full py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="mb-6 md:mb-0">
            <div className="text-lg font-black text-[#00113a] dark:text-white mb-2">iClocker</div>
            <p className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400">© 2024 iClocker. Secured by Architectural Layering.</p>
          </div>
          <div className="flex gap-8">
            <a className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 hover:text-[#006875] hover:underline transition-opacity" href="#">Privacy</a>
            <a className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 hover:text-[#006875] hover:underline transition-opacity" href="#">Terms</a>
            <a className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 hover:text-[#006875] hover:underline transition-opacity" href="#">Cookies</a>
            <a className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400 hover:text-[#006875] hover:underline transition-opacity" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Support;
