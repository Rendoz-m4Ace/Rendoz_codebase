'use client';

import { useState } from 'react';
import SocialLinks from '../components/SocialLinks';

export default function WaitlistFooter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Waitlist signup:', email);
    setEmail('');
  };

  return (
    <footer className="w-full text-white font-sans">
      {/* Upper Waitlist Call-to-Action Section */}
      <section className="bg-gradient-to-r from-[#1B4BDB] via-[#6B32A3] to-[#E52E2E] px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Be first in line for Rendoz.
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            We&apos;re building a simpler way to access the things you need. Join the waitlist and be among the first to know when Rendoz launches.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-1.5 shadow-lg"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-5 py-2.5 text-sm text-white placeholder-white/70 outline-none"
            />
            <button
              type="submit"
              className="bg-[#EA3829] hover:bg-[#d42d1f] transition-colors text-white font-semibold text-xs md:text-sm px-6 py-2.5 rounded-full whitespace-nowrap shadow-md"
            >
              Join the waitlist
            </button>
          </form>

          <p className="text-white/60 text-xs mt-4">
            No spam. Just Rendoz updates.
          </p>
        </div>
      </section>

      {/* Lower Navigation Footer Section */}
      <section className="bg-[#0A1128] px-6 py-16 md:px-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          {/* Brand Info */}
          <div className="max-w-xs">
            <h3 className="text-red-500 font-bold text-xl mb-3">Rendoz</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering Nigeria&apos;s sharing economy through trust, safety, and premium service.
            </p>
          </div>

          {/* Nav Links & Socials */}
          <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-20">
            {/* How It Works */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">How It Works</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">For Renters</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Owners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">Company</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Social Icons */}
            <div>
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-6xl mx-auto pt-12 mt-12 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Rendoz Marketplace. All rights reserved.
          </p>
        </div>
      </section>
    </footer>
  );
}