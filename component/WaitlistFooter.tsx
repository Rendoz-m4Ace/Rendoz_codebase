"use client";

import { useState } from "react";
// import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function WaitlistFooter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up to your waitlist endpoint / email provider
    console.log("Waitlist signup:", email);
    setEmail("");
  }

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-orange-500 px-6 py-20 md:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Be first in line for Rendoz.
        </h2>
        <p className="text-white/90 max-w-lg mx-auto mb-8">
          We&apos;re building a simpler way to access the things you need. Join the
          waitlist and be among the first to know when Rendoz launches.
        </p>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex rounded-full overflow-hidden bg-white p-1"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 text-slate-800 outline-none bg-transparent"
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 transition-colors text-white font-medium px-5 py-2 rounded-full whitespace-nowrap"
          >
            Join the waitlist
          </button>
        </form>
        <p className="text-white/70 text-xs mt-4">No spam. Just Rendoz updates.</p>
      </section>

      <footer className="bg-[#0b1533] px-6 py-16 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-orange-500 font-bold text-lg mb-3">Rendoz</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering Nigeria&apos;s sharing economy through trust, safety, and
              premium service.
            </p>
            {/* <div className="flex gap-4 mt-5 text-slate-400">
              <a href="#" aria-label="Facebook"><Facebook size={16} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
            </div> */}
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Marketplace</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">Luxury Cars</a></li>
              <li><a href="#" className="hover:text-white">Cinema Gear</a></li>
              <li><a href="#" className="hover:text-white">Creative Spaces</a></li>
              <li><a href="#" className="hover:text-white">Insurance</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Trust</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">Security</a></li>
              <li><a href="#" className="hover:text-white">Payments</a></li>
              <li><a href="#" className="hover:text-white">Verified Hosts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
            </ul>
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-12 text-center">
          © {new Date().getFullYear()} Rendoz Marketplace. All rights reserved.
        </p>
      </footer>
    </>
  );
}