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
    <section className="bg-[#0a0e1a] px-6 py-20 md:px-16">
      <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-3">
        Trust &amp; Safety
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-lg leading-tight">
        Built for renting with <br className="md:hidden" />
        confidence.
      </h2>
      <p className="text-slate-400 text-sm max-w-md mb-10">
        Trust is at the heart of a better rental <br className="md:hidden" /> experience.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {features.map((f) => (
          <div key={f.title} className="text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-4 mx-auto md:mx-0">
              <f.icon size={22} className="text-rose-500" />
            </div>
            <h3 className="text-white font-semibold mb-1">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}