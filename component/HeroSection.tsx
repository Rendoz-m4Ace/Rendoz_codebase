import Image from "next/image";
import { Camera, Bike, Zap, Laptop } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#D9E0EB] py-10 sm:py-14 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-6 md:flex-row md:gap-10 md:px-8">

        {/* Left Side: Content & Form */}
        <div className="w-full max-w-lg md:w-1/2">

          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black px-3 py-1 text-xs font-semibold text-gray-700">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            COMING SOON
          </div>

          {/* Main Heading */}
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl md:leading-[1.15]">
            Rent What You Need. <br className="hidden sm:inline" />
            Earn From What You Own.
          </h1>

          {/* Subheading */}
          <p className="mt-3 text-sm text-gray-600 sm:text-base leading-relaxed max-w-md">
            Rendoz makes it easy to find and rent the things you need without having to buy them. Access useful items for as long as you need them, then return them when you&apos;re done.
          </p>

          {/* Waitlist Form Container */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Get Early Access
            </p>
            <WaitlistForm variant="hero" />
            <p className="mt-2 text-xs text-[#696D73]">
              Built for owners and renters
            </p>
          </div>
        </div>

        {/* Right Side: Card Showcase */}
        <div className="w-full md:w-1/2 mt-4 sm:mt-6 md:mt-0">

          {/* Mobile / Tablet: 2×2 grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:hidden">

            {/* Camera */}
            <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-xl shadow-md border border-black/5">
              <Image
                src="/images/camera.png"
                alt="Camera"
                fill
                sizes="(max-width: 768px) 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#FFF9F5]/30 pointer-events-none" />
              <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                  <Camera className="h-3.5 w-3.5 text-black" />
                  <span className="text-xs font-semibold text-black leading-none">Camera</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Road Bike */}
            <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-xl border border-gray-200 bg-orange-50/80 shadow-md">
              <Image
                src="/images/bike.png"
                alt="Road Bike"
                fill
                sizes="(max-width: 768px) 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-orange-100/40 pointer-events-none" />
              <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                  <Bike className="h-3.5 w-3.5 text-black" />
                  <span className="text-xs font-semibold text-black leading-none">Road Bike</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Power Drill */}
            <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-xl border border-gray-200 bg-stone-100 shadow-md">
              <Image
                src="/images/power.png"
                alt="Power Drill"
                fill
                sizes="(max-width: 768px) 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-300/50 pointer-events-none" />
              <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                  <Zap className="h-3.5 w-3.5 text-black" />
                  <span className="text-xs font-semibold text-black leading-none">Power Drill</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Laptop */}
            <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-xl border border-gray-200 bg-purple-100 shadow-md">
              <Image
                src="/images/laptop.png"
                alt="Laptop"
                fill
                sizes="(max-width: 768px) 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-indigo-900/40 pointer-events-none" />
              <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                  <Laptop className="h-3.5 w-3.5 text-black" />
                  <span className="text-xs font-semibold text-black leading-none">Laptop</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

          </div>

          {/* Desktop: scattered absolute layout */}
          <div className="relative hidden md:block min-h-[420px] lg:min-h-[460px]">

            {/* Camera — top left */}
            <div className="absolute top-0 left-0 h-40 lg:h-44 w-52 lg:w-56 overflow-hidden rounded-xl shadow-md border border-black/5">
              <Image
                src="/images/camera.png"
                alt="Camera"
                fill
                sizes="224px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#FFF9F5]/30 pointer-events-none" />
              <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  <span className="flex items-center justify-center p-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                    <Camera className="h-4 w-4 text-black" />
                  </span>
                  <span className="text-sm font-semibold text-black leading-none">Camera</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Road Bike — top right, rotated */}
            <div className="absolute top-14 right-4 h-40 lg:h-44 w-52 lg:w-56 overflow-hidden rounded-xl border border-gray-200 bg-orange-50/80 shadow-md rotate-[6deg] z-10">
              <Image
                src="/images/bike.png"
                alt="Road Bike"
                fill
                sizes="224px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-orange-100/40 rounded-xl pointer-events-none" />
              <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  <span className="flex items-center justify-center p-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                    <Bike className="h-4 w-4 text-black" />
                  </span>
                  <span className="text-sm font-semibold text-black leading-none">Road Bike</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Power Drill — bottom left, rotated */}
            <div className="absolute top-52 left-4 h-40 lg:h-44 w-52 lg:w-56 overflow-hidden rounded-xl border border-gray-200 bg-stone-100 shadow-md -rotate-[5deg] z-10">
              <Image
                src="/images/power.png"
                alt="Power Drill"
                fill
                sizes="224px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-300/50 rounded-xl pointer-events-none" />
              <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  <span className="flex items-center justify-center p-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                    <Zap className="h-4 w-4 text-black" />
                  </span>
                  <span className="text-sm font-semibold text-black leading-none">Power Drill</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Laptop — bottom right, rotated */}
            <div className="absolute top-64 right-8 h-40 lg:h-44 w-52 lg:w-56 overflow-hidden rounded-xl border border-gray-200 bg-purple-100 shadow-md rotate-[8deg] z-20">
              <Image
                src="/images/laptop.png"
                alt="Laptop"
                fill
                sizes="224px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-indigo-900/40 rounded-xl pointer-events-none" />
              <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  <span className="flex items-center justify-center p-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                    <Laptop className="h-4 w-4 text-black" />
                  </span>
                  <span className="text-sm font-semibold text-black leading-none">Laptop</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-slate-800 font-medium leading-none">Coming soon</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
