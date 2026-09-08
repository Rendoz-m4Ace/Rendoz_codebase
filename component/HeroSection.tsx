import Image from "next/image";
import { Camera, Bike, Zap, Laptop } from "lucide-react";
import WaitlistForm from "./WaitlistForm";


export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#D9E0EB] py-12 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-4 md:flex-row md:px-8">
        
        {/* Left Side: Content & Form */}
        <div className="w-full max-w-lg md:w-1/2">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black px-3 py-1 text-xs font-semibold text-gray-700">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            COMING SOON
          </div>

          {/* Main Heading */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl md:leading-[1.5]">
            Rent What You Need. <br className="hidden sm:inline" />
            Earn From What You Own.
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-sm text-gray-600 sm:text-base leading-relaxed">
            Rendoz makes it easy to find and rent the things you need without having to buy them. Access useful items for as long as you need them, then return them when you're done.
          </p>

          {/* Waistlist Form Container*/}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Get Early Access
            </p>

            {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-white sm:bg-white/80 rounded-2xl sm:rounded-full p-1.5 border border-slate-200 shadow-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 min-w-0 bg-transparent px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                className="w-full sm:w-auto whitespace-nowrap rounded-xl sm:rounded-full bg-[#FE6E04] hover:bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Join the waitlist
              </button>
            </div>  */}

            <WaitlistForm variant="hero" />

            <p className="mt-2 text-xs text-[#696D73]">
              Built for owners and renters
            </p>
          </div>
        </div>

        {/* Right Side: Card Showcase */}
        {/* 1 Row on Mobile (grid-cols-4), Scattered Absolute on Desktop */}
        <div className="relative w-full md:w-1/2 mt-8 md:mt-0 relative min-h-[140px] md:min-h-[420px]">
          <div className="grid grid-cols-4 gap-2 md:block w-full">

            {/* 1. Camera Card */}
            <div className="relative h-28 sm:h-32 md:h-36 w-full md:w-56 overflow-hidden rounded-xl shadow-md border border-black/5">
              <Image
                src="/images/camera.png"
                alt="Camera"
                fill
                sizes="(max-width: 768px) 25vw, 224px"
                className="object-cover rounded-xl"
              />

              {/* Light ash content */}
              <div className="absolute inset-0 bg-[#FFF9F5]/30 pointer-events-none">

                {/* OVERLAY CONTENT (Badge & Text) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10 flex flex-col items-start gap-1">
                  
                  {/* Translucent dark badgecd */}
                  <div className="flex items-center gap-1">
                    <span className="flex items-center justify-center p-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                      <Camera className="h-4 w-4 text-black" />
                    </span>
                    <span className="text-sm font-semibold text-black leading-none">Camera</span>
                  </div>

                  {/* coming soon */}
                  <div className="flex items-center gap-1 px-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                  </div>
                </div> 
              </div>
             </div>


            {/* 2. Road Bike Card */}
            <div className="relative h-28 sm:h-32 md:h-36 w-full md:w-56 overflow-hidden rounded-xl border border-gray-200 bg-orange-50/80 p-2 shadow-md md:rotate-[6deg] md:absolute md:top-16 md:right-4 z-10">
              <Image
                src="/images/bike.png"
                alt="Road Bike"
                fill
                sizes="(max-width: 768px) 25vw, 224px"
                className="object-cover rounded-xl"
              />
              {/* Light ash content */}
              <div className="absolute inset-0 bg-orange-100/40 rounded-xl pointer-events-none" />
              
               {/* OVERLAY CONTENT (Badge & Text) */}
              <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10 flex flex-col items-start gap-1">

                {/* Translucent dark badgecd */}
                <div className="flex items-center gap-1">
                  <span className="flex items-center justify-center p-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                    <Bike className="h-4 w-4 text-black" />
                  </span>
                  <span className="text-sm font-semibold text-black leading-none">Road Bike</span>
                </div>

                {/* coming soon */}
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>


            {/* 3. Power Drill Card */}
            <div className="relative h-28 sm:h-32 md:h-36 w-full md:w-56 overflow-hidden rounded-xl border border-gray-200 bg-stone-100 p-2 shadow-md md:rotate-[-5deg] md:absolute md:top-48 md:left-4 z-10">

              <Image
                src="/images/power.png"
                alt="Power Drill"
                fill
                sizes="(max-width: 768px) 25vw, 224px"
                className="object-cover rounded-xl"
              />

               {/* Light ash content */}
              <div className="absolute inset-0 bg-stone-300/50 rounded-xl pointer-events-none" />

              {/* OVERLAY CONTENT (Badge & Text) */}
              <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10 flex flex-col items-start gap-1">

                {/* Translucent dark badgecd */}
                <div className="flex items-center gap-1">
                  <span className="flex items-center justify-center p-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                    <Zap className="h-4 w-4 text-black" />
                  </span>
                  <span className="text-sm font-semibold text-black leading-none">Power Drill</span>
                </div>

                {/* coming soon */}
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>

              </div>
            </div>

            {/* 4. Laptop Card */}
           <div className="relative h-28 sm:h-32 md:h-36 w-full md:w-56 overflow-hidden rounded-xl border border-gray-200 bg-purple-100 p-2 shadow-md md:rotate-[8deg] md:absolute md:top-60 md:right-8 z-20">
              <Image
                src="/images/laptop.png"
                alt="Laptop"
                fill
                sizes="(max-width: 768px) 25vw, 224px"
                className="object-cover rounded-xl"
              />
               {/* Light ash content */}
              <div className="absolute inset-0 bg-indigo-900/40 rounded-xl pointer-events-none" />

              {/* OVERLAY CONTENT (Badge & Text) */}
              <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10 flex flex-col items-start gap-1">

                {/* Translucent dark badgecd */}
                <div className="flex items-center gap-1">
                  <span className="flex items-center justify-center p-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                    <Laptop className="h-4 w-4 text-black" />
                  </span>
                  <span className="text-sm font-semibold text-black leading-none">Laptop</span>
                </div>

                {/* coming soon */}
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

          </div>-
        </div>

      </div>
  </section>
  

  );
}
