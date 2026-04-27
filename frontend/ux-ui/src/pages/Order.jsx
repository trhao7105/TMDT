import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const lockerSizes = [
  { id: 'small', name: 'Small', icon: 'inventory_2', desc: 'Perfect for backpacks, laptops, and hand luggage.', price: 12 },
  { id: 'medium', name: 'Medium', icon: 'inventory_2', desc: 'Standard suitcase or two large travel bags.', price: 18 },
  { id: 'large', name: 'Large', icon: 'luggage', desc: 'Ideal for bulky items or multiple large suitcases.', price: 25 },
];

const Order = () => {
  const [selectedSize, setSelectedSize] = useState('medium');
  
  const selectedLocker = lockerSizes.find(size => size.id === selectedSize) || lockerSizes[1];
  const duration = 3; // Static 3 days demo
  const securityFee = 4.5;
  const subTotal = selectedLocker.price * duration;
  const total = subTotal + securityFee;

  return (
    <div className="bg-surface font-body text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#00113a]/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,31,42,0.06)]">
        <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-[#00113a] dark:text-[#00e3fd] font-headline tracking-tight">iClocker</div>
          <div className="hidden md:flex items-center gap-8">
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/">Home</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/services">Services</Link>
            <Link className="text-[#00113a] dark:text-[#00e3fd] font-bold border-b-2 border-[#006875] pb-1" to="/order">Order</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#006875] transition-colors duration-300" to="/support">Support</Link>
          </div>
          <div className="flex items-center gap-4">
           <Link to="/login" className="px-6 py-2 rounded-full font-semibold text-[#00113a] hover:bg-surface-container-low transition-all active:scale-95">Login</Link>
            <Link to="/signup" className="px-6 py-2 rounded-full font-semibold text-[#00113a] hover:bg-surface-container-low transition-all active:scale-95">
              Sign Up
            </Link>
            <span className="material-symbols-outlined text-primary cursor-pointer">logout</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Title Section */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter mb-4">Secure Your <span className="text-secondary">Space.</span></h1>
          <p className="text-on-surface-variant max-w-xl text-lg">Experience the next generation of smart storage. Select your parameters and confirm your locker in seconds.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Process (Left Column) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Step 1: Select Size */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">01</span>
                <h2 className="text-2xl font-headline font-bold">Choose Locker Size</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lockerSizes.map((locker) => {
                  const isSelected = selectedSize === locker.id;
                  
                  return (
                    <div 
                      key={locker.id}
                      onClick={() => setSelectedSize(locker.id)}
                      className={`group p-8 rounded-xl transition-all cursor-pointer relative overflow-hidden ${
                        isSelected 
                          ? 'bg-primary-container shadow-[0_12px_32px_rgba(0,17,58,0.15)] ring-2 ring-secondary scale-[1.02]' 
                          : 'bg-surface-container-lowest border border-outline-variant/10 shadow-[0_8px_24px_rgba(0,31,42,0.04)] hover:shadow-lg'
                      }`}
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <span 
                          className={`material-symbols-outlined ${
                            isSelected ? 'text-secondary-container' : 'text-secondary opacity-20 group-hover:opacity-100 transition-opacity'
                          }`}
                          {...(isSelected ? { "data-weight": "fill" } : {})}
                        >
                          {locker.icon}
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-on-primary' : ''}`}>{locker.name}</h3>
                      <p className={`text-sm mb-6 ${isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{locker.desc}</p>
                      <div className="mt-auto">
                        <span className={`text-3xl font-black ${isSelected ? 'text-white' : 'text-primary'}`}>${locker.price}</span>
                        <span className={`text-sm ${isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>/day</span>
                      </div>
                      {isSelected && <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Duration */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">02</span>
                <h2 className="text-2xl font-headline font-bold">Rental Duration</h2>
              </div>
              <div className="bg-surface-container-low p-8 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-on-surface-variant">Check-in Date</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-highest rounded-xl px-6 py-4 border-none focus:ring-2 focus:ring-secondary text-primary font-medium" type="date" defaultValue="2024-05-20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-on-surface-variant">Check-out Date</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-highest rounded-xl px-6 py-4 border-none focus:ring-2 focus:ring-secondary text-primary font-medium" type="date" defaultValue="2024-05-23" />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3: Checkout Details */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">03</span>
                <h2 className="text-2xl font-headline font-bold">Payment Information</h2>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                      <label className="block text-sm font-semibold mb-3 text-on-surface-variant">Cardholder Name</label>
                      <input className="w-full bg-surface-container-highest rounded-xl px-6 py-4 border-none focus:ring-2 focus:ring-secondary" placeholder="Johnathan Doe" type="text" />
                    </div>
                    <div className="col-span-full">
                      <label className="block text-sm font-semibold mb-3 text-on-surface-variant">Card Number</label>
                      <div className="relative">
                        <input className="w-full bg-surface-container-highest rounded-xl px-6 py-4 border-none focus:ring-2 focus:ring-secondary" placeholder="**** **** **** 4242" type="text" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                          <span className="material-symbols-outlined text-primary">credit_card</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-on-surface-variant">Expiry Date</label>
                      <input className="w-full bg-surface-container-highest rounded-xl px-6 py-4 border-none focus:ring-2 focus:ring-secondary" placeholder="MM/YY" type="text" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-on-surface-variant">CVV</label>
                      <input className="w-full bg-surface-container-highest rounded-xl px-6 py-4 border-none focus:ring-2 focus:ring-secondary" placeholder="***" type="password" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-primary p-8 rounded-xl shadow-2xl text-white relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary opacity-10 rounded-full blur-3xl"></div>
              <h2 className="text-xl font-headline font-bold mb-8 flex items-center justify-between">
                Order Summary
                <span className="material-symbols-outlined" data-weight="fill">receipt_long</span>
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary-fixed-dim text-sm">Selected Locker</p>
                    <p className="font-bold text-lg">{selectedLocker.name} Unit</p>
                  </div>
                  <p className="font-bold">${selectedLocker.price.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary-fixed-dim text-sm">Duration</p>
                    <p className="font-bold">{duration} Days</p>
                  </div>
                  <p className="font-bold">${subTotal.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary-fixed-dim text-sm">Security Fee</p>
                    <p className="font-bold">Insurance Incl.</p>
                  </div>
                  <p className="font-bold">${securityFee.toFixed(2)}</p>
                </div>
                
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-secondary-container text-xs font-bold uppercase tracking-widest">Total Amount</p>
                    <p className="text-4xl font-black">${total.toFixed(2)}</p>
                  </div>
                  <div className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded font-black">USD</div>
                </div>
              </div>
              
              <button className="w-full bg-secondary-fixed text-on-secondary-fixed py-5 rounded-full font-bold text-lg hover:bg-secondary-fixed-dim transition-colors active:scale-95 flex items-center justify-center gap-3">
                Confirm &amp; Pay
                <span className="material-symbols-outlined">lock_open</span>
              </button>
              
              <p className="text-center text-[10px] mt-6 text-primary-fixed-dim/60 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                Bank-grade 256-bit SSL Encryption
              </p>
            </div>
            
            {/* Live Status Chip (Secondary) */}
            <div className="mt-6 flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-secondary/20">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
              <div>
                <p className="text-xs font-bold text-secondary">LIVE AVAILABILITY</p>
                <p className="text-sm font-medium">12 {selectedLocker.name} lockers available at Central St.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-[#f4faff] dark:bg-[#00113a]">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 border-t border-slate-200 dark:border-slate-800 pt-12 max-w-7xl mx-auto">
          <div className="mb-8 md:mb-0">
            <div className="text-lg font-black text-[#00113a] dark:text-white font-headline mb-2">iClocker</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-['Inter']">© 2024 iClocker. Secured by Architectural Layering.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Privacy</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Terms</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Cookies</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm font-['Inter'] hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Order
