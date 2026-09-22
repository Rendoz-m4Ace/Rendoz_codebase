import { Search, ShieldCheck, PackageCheck, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    iconBg: 'bg-violet-500',
    title: 'Browse',
    description: 'Search thousands of items available for rent near you across multiple categories.',
  },
  {
    icon: PackageCheck,
    iconBg: 'bg-orange-500',
    title: 'Book & Pay',
    description: 'Pick your rental dates, pay securely online. No hidden charges.',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-pink-500',
    title: 'Deliver',
    description: 'Item gets delivered to you or you pick it up from the owner. Simple and fast.',
  },
  {
    icon: Star,
    iconBg: 'bg-blue-500',
    title: 'Return',
    description: 'Return the item when you\'re done. Leave a review and help the community.',
  },
];

export default function HowRendozWorks() {
  return (
    <section id="how-it-works" className="bg-[#0B1220] py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          How <span className="text-orange-500">Rendoz</span> works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px border-t border-dashed border-white/20" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <div className={`w-14 h-14 rounded-full ${step.iconBg} flex items-center justify-center shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
