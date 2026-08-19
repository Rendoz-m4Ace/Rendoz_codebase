import {DollarSign, Box, Clock, TrendingDown } from "lucide-react";

export default function Why() {
  const reasons = [
    {
      number: "01",
      icon: <DollarSign className=" w-5 h-5 text-slate-700" />,
      title: "Expensive",
      description: "Buying something you only need occasionally can be unnecessarily expensive."
    },
    {
      number: "02", 
      icon: <Box className=" w-5 h-5 text-slate-700" />,
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
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Why buy something
        </h2>
        <h2 className="text-2xl font-bold text-gray-900 mb-10">
          you'll only use once?
        </h2>
        <p className="text-gray-500 mb-10">
          Most of us have paid full price for things we barely touched again — because buying felt like the only option.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reasons.map((reason) => (
            <div key={reason.number} className="border border-gray-200 rounded-xl p-4">
              <p className="text-orange-500 text-sm font-medium mb-2">{reason.number}</p>
               <p className="mb-2">{reason.icon}</p>
              <h3 className="font-semibold text-gray-900 mb-2">{reason.title}</h3>
              <p className="text-gray-500 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}