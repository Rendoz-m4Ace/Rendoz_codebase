const steps = [
  { num: 1, title: "FIND", desc: "Search and discover the item you need." },
  { num: 2, title: "RENT", desc: "Choose the item and the period you need it for." },
  { num: 3, title: "USE", desc: "Get the item and use it for your intended purpose." },
  { num: 4, title: "RETURN", desc: "Return the item when your rental period is complete." },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F5F3EF] px-6 py-20 md:px-16">
      <p className="text-xs font-semibold tracking-widest text-orange-600 uppercase mb-3">
        How It Works
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-14 max-w-lg leading-tight">
        Find it. Rent it. Use it. Return it.
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {steps.map((s) => (
          <div key={s.num}>
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold mb-5">
              {s.num}
            </div>
            <h3 className="text-slate-900 font-bold tracking-wide mb-2">{s.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}