import { ShieldCheck, CreditCard, FileText, Star, LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Verified Users",
    desc: "Help create a safer rental experience with verified users.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "Make payments through a secure rental experience.",
  },
  {
    icon: FileText,
    title: "Clear Rental Terms",
    desc: "Know the rental period, expectations, and terms.",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    desc: "Make informed decisions through community feedback.",
  },
];

export default function TrustFeatures() {
  return (
    <section className="bg-[#0a0e1a] px-4 sm:px-6 py-14 sm:py-20 md:px-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-3">
          Trust &amp; Safety
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 max-w-lg leading-tight">
          Built for renting with confidence.
        </h2>
        <p className="text-slate-400 text-sm max-w-md mb-8 sm:mb-10">
          Trust is at the heart of a better rental experience.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-rose-500" />
              </div>
              <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
