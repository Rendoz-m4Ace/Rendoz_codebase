import Image from "next/image";
import Why from "./why";
import What from "./what";
import { Camera, Bike, Zap, Laptop } from "lucide-react";


export default function HeroSection() {
  return (
    <main className="flex-1">
      <section className="bg-[#dfe3f3]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 md:min-h-[29rem] md:grid-cols-[52%_48%] md:gap-0 md:py-10">
          {/* Left: text */}
          <div>
            <span className="inline-block text-xs font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
              COMING SOON
            </span>

            <h1 className="mt-4 max-w-[410px] text-4xl font-bold leading-[1.08] text-slate-900 md:text-[38px]">
              Rent What You Need. Earn From What You Own.
            </h1>

            <p className="mt-4 max-w-[390px] text-[11px] leading-[1.35] text-slate-600">
              Rendoz makes it easy to find and rent the things you need without
              having to buy them. Access useful items for as long as you need
              them, then return them when you&apos;re done.
            </p>

            <p className="mt-5 text-[9px] font-semibold uppercase tracking-wide text-orange-500">
              Get Early Access
            </p>

            <form className="mt-1 flex max-w-[270px] flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[9px] focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="rounded-full bg-orange-500 px-4 py-1.5 text-[9px] font-medium text-white transition hover:bg-orange-600"
              >
                Join the waitlist
              </button>
            </form>

            <p className="mt-2 text-[9px] text-slate-400">
              Built for owners and renters
            </p>
          </div>
          <div className="relative grid w-full grid-cols-1 gap-5 py-4 min-[420px]:grid-cols-2 md:block md:min-h-[22rem] md:py-0">
            {/* Camera */}
            <div className="relative h-32 w-full overflow-hidden rounded-xl  p-2 shadow-lg rotate-[-3deg] min-[420px]:rotate-[-6deg] md:absolute md:left-[16%] md:top-0 md:h-24 md:w-40">
              <Image
                src="/images/camera.png"
                alt="Camera"
                fill
                sizes="208px"
                className="object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative">
                <div className="relative flex items-center gap-1 p-2">
                  <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                    <Camera className="h-3 w-3 text-black" />
                  </span>
                  <span className="text-[12px] font-semibold text-black">Camera</span>
                </div>
                <p className="relative flex items-center gap-1 text-[10px] text-black">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />{" "}
                  Coming soon
                </p>
                </div>
            </div>

            {/* Bike */}
            <div className="relative h-32 w-full overflow-hidden rounded-xl bg-amber-200 p-2 shadow-lg rotate-[3deg] min-[420px]:rotate-[5deg] md:absolute md:left-[44%] md:top-16 md:h-24 md:w-40">
              <Image
                src="/images/bike.png"
                alt="bike"
                fill
                sizes="208px"
                className="object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative">
                <div className="relative flex items-center gap-1 p-2">
                  <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                    <Bike className="h-3 w-3 text-black" />
                  </span>
                  <span className="text-[12px] font-semibold text-black">
                    Road Bike
                  </span>
                </div>
                <p className="relative flex items-center gap-1 text-[10px] text-black">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                  Coming soon
                </p>
              </div>  
            </div>

            {/* Power drill */}
            <div className="relative h-32 w-full overflow-hidden rounded-xl p-2 shadow-lg rotate-[-2deg] md:absolute md:left-[16%] md:top-[10.5rem] md:h-24 md:w-40">
              <Image
                src="/images/drill.png"
                alt="power"
                fill
                sizes="208px"
                className="object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative">
                <div className="relative flex items-center gap-1 p-2">
                  <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                    <Zap className="h-3 w-3 text-black" />
                  </span>
                  <span className="text-[12px] font-semibold text-black">
                    Power Drill
                  </span>
                </div>
              <p className="relative flex items-center gap-1 text-[10px] text-black">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                Coming soon
              </p>
              </div>
            </div>

            {/* Laptop */}
            <div className="relative h-40 w-full overflow-hidden rounded-xl p-2 shadow-lg rotate-[3deg] min-[420px]:rotate-[4deg] md:absolute md:left-[43%] md:top-[13.5rem] md:h-24 md:w-40">
              <Image
                src="/images/laptop.png"
                alt="laptop"
                fill
                sizes="208px"
                className="object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative">
                <div className="relative flex items-center gap-1 p-2">
                <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                  <Laptop className="h-3 w-3 text-black" />
                </span>
                <span className="text-[12px] font-semibold text-black">
                  Laptop
                </span>
                </div>
              <p className="relative flex items-center gap-1 text-[10px] text-black">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                Coming soon
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Why />
      <What />
    </main>
  );
}


