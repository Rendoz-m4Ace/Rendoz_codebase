import Image from "next/image";
import Why from "./why";
import What from "./what";
import { Camera, Bike, Zap, Laptop } from "lucide-react";

export default function HeroSection () {
    return (
        <main className="flex-1">
      <section className="bg-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          {/* Left: text */}
          <div>
            <span className="inline-block text-xs font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
              COMING SOON
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight text-slate-900">
              Rent What You Need. Earn From What You Own.
            </h1>

            <p className="mt-4 text-slate-600 max-w-md">
              Rendoz makes it easy to find and rent the things you need
              without having to buy them. Access useful items for as long
              as you need them, then return them when you&apos;re done.
            </p>

            <p className="mt-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Get Early Access
            </p>

            <form className="mt-2 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2 rounded-full transition"
              >
                Join the waitlist
              </button>
            </form>

            <p className="mt-3 text-xs text-slate-400">
              Built for owners and renters
            </p>
          </div>
          <div className="relative h-[420px]">

          {/* Camera */}
          <div className="absolute top-0 right-8 bg-amber-800 rounded-xl rotate-[-6deg] shadow-lg w-52 h-30 p-3">
            <div className="flex items-center gap-2">
              <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                <Camera className="w-4 h-4 text-amber-800" />
              </span>
              <span className="text-white font-semibold text-sm">Camera</span>
            </div>
            <p className="text-xs text-white/80 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" /> Coming soon
            </p>
          </div>

          {/* Bike */}
          <div className="absolute top-20 left-8 bg-stone-400 rounded-xl shadow-lg rotate-[5deg] w-52 h-30 p-3">
            <div className="flex items-center gap-2">
              <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                <Bike className="w-4 h-4 text-purple-700" />
              </span>
              <span className="text-white font-semibold text-sm">Road Bike</span>
            </div>
            <p className="text-xs text-white/80 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" /> Coming soon
            </p>
          </div>

          {/* Power drill */}
          <div className="absolute top-50 right-30 bg-stone-500 rounded-xl shadow p-3 rotate-[-3deg] w-52 h-30">
            <div className="flex items-center gap-2">
              <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                <Zap className="w-4 h-4 text-stone-500" />
              </span>
              <span className="text-white font-semibold text-sm">Power Drill</span>
            </div>
            <p className="text-xs text-white/80 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" /> Coming soon
            </p>
          </div>

          {/* Laptop */}
          <div className="absolute top-70 right-0 bg-purple-400 rounded-xl shadow p-3 rotate-[4deg] w-52 h-32">
            <div className="flex items-center gap-2">
              <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                <Laptop className="w-4 h-4 text-gray-700" />
              </span>
              <span className="text-white font-semibold text-sm">Laptop</span>
            </div>
            <p className="text-xs text-white/80 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" /> Ready to Rent
            </p>
          </div>
      </div>
      </div>  
    </section>
    <Why />
    <What /> 
  </main>
  );
}
    
