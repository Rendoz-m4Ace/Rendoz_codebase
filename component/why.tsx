import {DollarSign, Box, Clock, TrendingDown } from "lucide-react";

export default function Why() {
  const reasons = [
    {
      number: "01",
      icon: <span className="font-bold text-black text-base">N</span>,
      title: "Expensive",
      description: "Buying something you only need occasionally can be unnecessarily expensive."
    },
    {
      number: "02", 
      icon: <Box className=" w-5 h-5 text-black" />,
      title: "Takes Space",
      description: "Items that aren't used regularly end up taking up valuable storage space."
    },
    {
      number: "03",
      icon: <Clock className=" w-5 h-5 text-slate-700" />,
      title: "Short-Term Needs",
      description: "Some things are only needed for an event, project, trip, or short period."
    },
    {
      number: "04",
      icon: <TrendingDown className=" w-5 h-5 text-slate-700" />,
      title: "Poor Value",
      description: "Buying an item that sits unused wastes your money to find use in something you rarely use."
    }
  ]

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[120%] tracking-[-0.02em] font-['Inter'] font-bold text-[#101216] max-w-lg">
            Why buy something you&apos;ll only use once?
          </h2>
          <p className="mt-4 font-['Inter'] font-normal text-sm sm:text-base md:text-lg leading-relaxed text-[#525559] max-w-xl">
            Most of us have paid full price for things we barely touched again — because buying felt like the only option.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reasons.map((reason) => (
            <div key={reason.number} className="border border-gray-200 rounded-xl p-5 flex flex-col">
              <p className="text-black text-sm font-medium mb-2">{reason.number}</p>
              <div className="mb-3 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">{reason.icon}</div>
              <h3 className="text-[#101216] font-['Inter'] font-bold leading-[120%] tracking-[0.02em] text-lg sm:text-xl mb-2">{reason.title}</h3>
              <p className="text-black font-['Inter'] text-sm sm:text-base font-normal leading-[140%]">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




