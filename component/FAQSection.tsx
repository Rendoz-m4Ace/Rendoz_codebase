"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "What is Rendoz?",
    answer:
      "Rendoz is a marketplace that lets you rent everyday and premium items from verified owners near you.",
  },
  {
    question: "What can I rent on Rendoz?",
    answer:
      "Everything from luxury cars and cinema gear to creative spaces, with more categories added over time.",
  },
  {
    question: "Who can list an asset?",
    answer: "Any verified individual or business owner can list an asset for rent.",
  },
  {
    question: "Can businesses list multiple assets?",
    answer: "Yes, verified business accounts can list and manage multiple assets.",
  },
  {
    question: "How will owners be verified?",
    answer: "Owners go through an identity and ownership verification process before listing.",
  },
  {
    question: "How does payment work?",
    answer: "Payments are processed securely through Rendoz at the time of booking.",
  },
  {
    question: "Is a security deposit required?",
    answer: "Some listings require a refundable security deposit, shown before checkout.",
  },
  {
    question: "How long can I rent an asset?",
    answer: "Rental periods are set by the owner and can range from hours to weeks.",
  },
  {
    question: "Will Rendoz be available in Lagos?",
    answer: "Lagos is part of our initial launch markets.",
  },
  {
    question: "When is Rendoz launching?",
    answer: "We're finalizing launch details — join the waitlist to be notified first.",
  },
  {
    question: "How can I become an early user?",
    answer: "Join the waitlist above to get early access before public launch.",
  },
];

function FAQRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-slate-900 font-medium group-hover:text-orange-600 transition-colors">
          {question}
        </span>
        <ChevronRight
          size={18}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && (
        <p className="text-slate-500 text-sm leading-relaxed pb-5 pr-8">{answer}</p>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="bg-white px-6 py-20 md:px-16">
      <p className="text-xs font-semibold tracking-widest text-orange-600 uppercase mb-3">
        FAQ
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
        Before you join.
      </h2>
      <div className="max-w-2xl border-t border-slate-200">
        {faqs.map((f) => (
          <FAQRow key={f.question} question={f.question} answer={f.answer} />
        ))}
      </div>
    </section>
  );
}