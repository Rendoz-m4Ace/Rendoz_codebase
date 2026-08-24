import Image from "next/image";
import Why from "./why";
import What from "./what";
import { Camera, Bike, Zap, Laptop } from "lucide-react";


export default function HeroSection() {
  return (
    <main className="flex-1">
      <section className="bg-[#D9E0EB] font-['Inter']">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-[60px] py-20 md:min-h-[29rem] md:grid-cols-[52%_48%] md:gap-0 md:py-10">
          {/* Left: text */}
          <div>
            <span className="inline-flex items-center gap-2 border border-grey-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-900 bg-transparent">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              COMING SOON
            </span>  

            <h1 className="mt-4 max-w-[410px] text-7xl font-bold leading-[120%] tracking-[-0.03em] text-[#101216] md:text-[38px]">
              Rent What You Need. Earn From What You Own.
            </h1>

            <p className="font-normal not-italic mt-4 max-w-[390px] text-base leading-[120%] text-[#2E3440]">
              Rendoz makes it easy to find and rent the things you need without
              having to buy them. Access useful items for as long as you need
              them, then return them when you&apos;re done.
            </p>
            <p className="mt-5 text-base leading-[140%] font-semibold uppercase text-[#FE6E04]">
              Get Early Access
            </p>
            <form className="mt-1 Font-Semibold text-base leading-[140%] flex max-w-[270px] flex-col text-[#5255559] gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[9px] focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="rounded-full bg-[#FE6E04] px-4 py-1.5 font-semibold text-base leading-[140%] text-white transition hover:bg-orange-600"
              >
                Join the waitlist
              </button>
            </form>

            <p className="mt-2 text-base font-normal leading-[140%] text-[#696D73]">
              Built for owners and renters
            </p>
          </div>



          <div className="relative grid w-full grid-cols-1 gap-5 py-4 min-[420px]:grid-cols-2 md:block md:min-h-[22rem] md:py-0">
            {/* Camera */}
            <div className="relative bg-[rgba(255,249,245,0.37)] border border-[#B0B6BF] h-32 w-full overflow-hidden rounded-xl p-2 shadow-lg rotate-[-9deg] md:absolute md:left-[16%] md:top-0 md:h-24 md:w-40">
              <Image
                src="/images/camera.png"
                alt="Camera"
                fill
                sizes="208px"
                className="object-cover rounded-xl"
              />
              {/* <div className="absolute inset-0 bg-black/30" /> */}
              <div className="relative rotate-[-9deg]">
                <div className="relative flex items-center gap-1 p-2">
                  <span className="bg-white  rounded-full p-1.5 flex items-center justify-center">
                    <Camera className="h-3 w-3 text-black" />
                  </span>
                  <span className="text-xl font-semibold leading-[120%] tracking-[0.02em] text-black">Camera</span>
                </div>
                <p className="relative flex items-center gap-1 text-[10px] pl-4 text-black">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />{" "}
                  Coming soon
                </p>
              </div>
            </div>

            {/* Bike */}
            <div className="relative h-288px w-168px overflow-hidden rounded-xl  items-start p-2 shadow-lg rotate-[9deg] md:absolute md:left-[44%] md:top-16 md:h-24 md:w-40">
              <Image
                src="/images/bike.png"
                alt="bike"
                fill
                sizes="208px"
                className="object-cover rounded-xl"
              />
              {/* <div className="absolute inset-0 bg-black/30" /> */}
              <div className="relative rotate-[9deg]">
                <div className="relative flex items-center gap-1 p-2">
                  <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                    <Bike className="h-3 w-3 text-black" />
                  </span>
                  <span className="text-xl font-semibold text-black">
                    Road Bike
                  </span>
                </div>
                <p className="relative flex items-center gap-1 text-[10px] pl-4 text-black">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                  Coming soon
                </p>
              </div>  
            </div>



            {/* Power drill */}
            <div className="relative h-32 w-full overflow-hidden rounded-xl p-2 shadow-lg rotate-[-9deg] md:absolute md:left-[16%] md:top-[10.5rem] md:h-24 md:w-40">
              <Image
                src="/images/drill.png"
                alt="power"
                fill
                sizes="208px"
                className="object-cover rounded-xl"
              />
              {/* <div className="absolute inset-0 bg-black/30" /> */}
              <div className="relative rotate-[-9deg]">
                <div className="relative flex items-center gap-1 p-2">
                  <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                    <Zap className="h-3 w-3 text-black" />
                  </span>
                  <span className="text-lg rotate-[-3deg] font-semibold text-black">
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
            <div className="relative h-40 w-full overflow-hidden rounded-xl p-2 shadow-lg rotate-[-9deg]  md:absolute md:left-[43%] md:top-[13.5rem] md:h-24 md:w-40">
              <Image
                src="/images/laptop.png"
                alt="laptop"
                fill
                sizes="208px"
                className="object-cover rounded-xl"
              />
              {/* <div className="absolute inset-0 bg-black/30" /> */}
              <div className="relative rotate-[6deg]">
                <div className="relative flex items-center gap-1 p-2">
                <span className="bg-white rounded-full p-1.5 flex items-center justify-center">
                  <Laptop className="h-3 w-3 text-black" />
                </span>
                <span className="text-lg font-semibold text-black">
                  Laptop
                </span>
                </div>
              <p className="relative flex items-center gap-1 text-[10px] pl-4 text-black">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full " />
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


