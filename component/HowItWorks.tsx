'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const contentData = {
  renters: {
    heading: 'Find it. Rent it. Use it. Return it.',
    activeColor: 'bg-orange-600 text-white',
    badgeBorder: 'border-orange-600 text-orange-600',
    badgeOuter: 'border-orange-200 bg-orange-50/40',
    titleHover: 'group-hover:text-orange-600',
    steps: [
      { num: 1, title: 'FIND', desc: 'Search and discover the item you need.' },
      { num: 2, title: 'RENT', desc: 'Choose the item and the period you need it for.' },
      { num: 3, title: 'USE', desc: 'Get the item and use it for your intended purpose.' },
      { num: 4, title: 'RETURN', desc: 'Return the item when your rental period is complete.' },
    ],
  },
  owners: {
    heading: 'Turn your unused assets into income.',
    activeColor: 'bg-[#1E3A8A] text-white',
    badgeBorder: 'border-[#1E3A8A] text-[#1E3A8A]',
    badgeOuter: 'border-blue-200 bg-blue-50/40',
    titleHover: 'group-hover:text-[#1E3A8A]',
    steps: [
      { num: 1, title: 'LIST YOUR ASSET', desc: 'Add your asset details, photos, condition, pricing, and availability.' },
      { num: 2, title: 'GET VERIFIED', desc: 'Complete verification and submit your listing for approval.' },
      { num: 3, title: 'ACCEPT & HANDOVER', desc: 'Receive booking requests, accept the ones that work for you, and hand over the asset with its condition documented.' },
      { num: 4, title: 'GET PAID', desc: 'Hand over the asset, complete the rental, and receive your applicable payout.' },
    ],
  },
};

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState<'renters' | 'owners'>('owners');
  const current = contentData[activeRole];

  return (
    <section className="bg-[#F5F7FA] px-6 py-20 md:px-16 overflow-hidden" id='how-it-works'>
      <div className="max-w-6xl mx-auto">
        {/* Header & Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold tracking-widest text-orange-600 uppercase mb-2">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {current.heading}
            </h2>
          </motion.div>

          {/* Segmented Toggle Control */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#E2E7ED] p-1.5 rounded-2xl flex items-center w-fit m-auto shadow-inner relative"
          >
            <button
              type="button"
              onClick={() => setActiveRole('renters')}
              className={`relative z-10 px-6 py-2.5 text-xs font-bold rounded-xl transition-colors duration-200 ${
                activeRole === 'renters' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RENTERS
              {activeRole === 'renters' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-orange-600 rounded-xl -z-10 shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('owners')}
              className={`relative z-10 px-6 py-2.5 text-xs font-bold rounded-xl transition-colors duration-200 ${
                activeRole === 'owners' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OWNERS
              {activeRole === 'owners' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#1E3A8A] rounded-xl -z-10 shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          >
            {current.steps.map((s, index) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group flex flex-col items-center text-center p-6 bg-white/60 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300 "
              >
                {/* Number Badge */}
                <div
                  className={`w-14 h-14 rounded-full border flex items-center justify-center mb-5 transition-all duration-300 ${current.badgeOuter}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-extrabold text-sm transition-colors duration-300 ${current.badgeBorder}`}
                  >
                    {s.num}
                  </div>
                </div>

                <h3
                  className={`text-slate-900 font-extrabold tracking-wider mb-2 text-sm uppercase transition-colors ${current.titleHover}`}
                >
                  {s.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[210px]">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}