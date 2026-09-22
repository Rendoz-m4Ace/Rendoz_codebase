'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const faqs = [
  {
    question: 'What is Rendoz?',
    answer:
      'Rendoz is a peer-to-peer rental marketplace that makes it easier to discover, compare, book, and rent items for a specific period — and to list assets you own to earn income.',
  },
  {
    question: 'What can I rent on Rendoz?',
    answer:
      'Cameras, vehicles, generators, tools, fashion, event gear, furniture, electronics, and more from verified owners near you.',
  },
  {
    question: 'Who can list an asset?',
    answer:
      'Anyone with an item they own can list after completing identity verification. Businesses can manage multiple listings from one account.',
  },
  {
    question: 'How does payment work?',
    answer:
      'The renter pays on Rendoz. Funds are held until the rental is completed, then the owner payout is released according to platform terms.',
  },
  {
    question: 'Is a security deposit required?',
    answer:
      'A deposit may be required depending on the asset and the owner’s terms. If the item is returned as agreed, the deposit is released.',
  },
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-4 md:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-2 text-center">
          FAQ
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
          Questions? We have the answers
        </h2>
        <div className="border-t border-slate-200">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="w-full flex items-center justify-between py-5 text-left min-h-11 group"
                  aria-expanded={open}
                >
                  <span className="text-slate-900 font-medium group-hover:text-orange-600 pr-4">
                    {faq.question}
                  </span>
                  <ChevronRight
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
                  />
                </button>
                {open && (
                  <p className="pb-5 pr-8 text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
