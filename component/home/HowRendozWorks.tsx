import { Search, ShieldCheck, PackageCheck, Star } from 'lucide-react';

const steps = [
  {
    icon: <Search size={20} className="text-white" />,
    iconBg: 'bg-purple-500',
    step: '01',
    title: 'Browse',
    description: 'Search thousands of items available for rent near you across multiple categories.',
  },
  {
    icon: <PackageCheck size={20} className="text-white" />,
    iconBg: 'bg-orange-500',
    step: '02',
    title: 'Book & Pay',
    description: 'Pick your rental dates, pay securely online. No hidden charges.',
  },
  {
    icon: <ShieldCheck size={20} className="text-white" />,
    iconBg: 'bg-pink-500',
    step: '03',
    title: 'Deliver',
    description: 'Item gets delivered to you or you pick it up from the owner. Simple and fast.',
  },
  {
    icon: <Star size={20} className="text-white" />,
    iconBg: 'bg-blue-500',
    step: '04',
    title: 'Return',
    description: 'Return the item when you\'re done. Leave a review and help the community.',
  },
];

export default function HowRendozWorks() {
  return (
    <section className="bg-[#1B2B6B] py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">Simple Process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How it <span className="text-orange-400">Rendoz</span> works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-white/20 z-0" />

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col gap-4">
              {/* Icon circle */}
              <div className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-lg`}>
                {step.icon}
              </div>

              {/* Step number */}
              <p className="text-xs font-bold text-white/40 tracking-widest">{step.step}</p>

              {/* Title */}
              <h3 className="text-base font-bold text-white">{step.title}</h3>

              {/* Description */}
              <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
