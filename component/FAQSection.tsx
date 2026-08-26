"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "What is Rendoz?",
    answer:
      "Rendoz is a peer-to-peer and business asset rental marketplace that makes it easier to discover, compare, book, and rent items for a specific period. It also allows individuals and businesses to list assets they own and earn income when those assets are rented. Own it? Rent it out. Need it? Rent it.",
  },
  {
    question: "What can I rent on Rendoz?",
    answer: "Rendoz is designed to support multiple asset categories, including:",
    list: [
      "Fashion & Accessories",
      "Electronics & Technology",
      "Photography & Videography",
      "Events & Entertainment",
      "Tools & Equipment",
      "Vehicles",
      "Home & Living",
      "Education"
    ]
  },

  {
    question: "Who can list an asset?",
    answer: "Owners can provide information about their assets, upload photos, set rental prices, specify availability, and manage their listings.",
  },
  {
    question: "Can businesses list multiple assets?",
    answer: "Yes. Rendoz is designed to support businesses with multiple rental assets. Businesses should be able to manage multiple listings from one account. Business owners may also provide additional information such as their business name, description, and registration information where required.",
  },
  {
    question: "How will owners be verified??",
    answer: "Trust is a key part of Rendoz. Users can have verification statuses such as Unverified, Verification Pending, Verified, or Rejected. Possible verification requirements include phone verification, email verification, and NIN verification. For certain assets, Rendoz may also require additional information such as proof of ownership, serial numbers, detailed photos, or other documentation. The exact verification process will comply with applicable Nigerian privacy and data-protection requirements.",
  },
  // {
  //   question: "How does payment work?",
  //   answer: "Owners go through an identity and ownership verification process before listing.",
  // },
  {
    question: "How does payment work?",
    answer: "Rendoz is designed to facilitate rental transactions within the platform.Rental fee + applicable Rendoz fee + security deposit + delivery fee, where applicable.The recommended payment flow is: Renter pays → Rendoz receives payment → Booking is confirmed → Rental occurs → Return is confirmed → Applicable owner payout is released.This structure allows Rendoz to manage payments, deposits, refunds, commissions, and disputes.",
  },
  {
    question: "Is a security deposit required?",
    answer: "A security deposit may be required, depending on the asset and the owner's rental terms. For example, an owner may require a security deposit in addition to the rental fee. If the asset is returned normally, the deposit is released or refunded according to Rendoz's terms. If damage occurs, the owner may initiate a damage claim.",
  },
  {
    question: "How long can I rent an asset?",
    answer: "Rental periods can vary depending on the asset and the owner's pricing model. The platform is not restricted to daily rentals because different asset categories have different rental needs. Rendoz is designed to support:",
    list: [
      "Hourly rentals",
      "Daily rentals",
      "Weekly rentals",
      "Custom rental periods"
    ],
  },
  {
    question: "Will Rendoz be available in Lagos?",
    answer: "Yes. Lagos, Nigeria is Rendoz's initial market. The long-term vision is to build a scalable marketplace that can support multiple asset categories and expand beyond the initial market.",
  },
  {
    question: "When is Rendoz launching?",
    answer: "Rendoz is currently being developed toward its MVP, with the goal of enabling a complete rental transaction from listing and discovery through booking, payment, handover, return, and review. Join the waitlist to stay informed about the launch."
  },
  {
    question: "How can I become an early user?",
    answer: "Join the Rendoz waitlist to express your interest in using the platform when it launches. Whether you want to rent something you need or earn from assets you already own, you can join the waitlist and be part of the early Rendoz community. Own it? Rent it out. Need it? Rent it..",
  },
];

function FAQRow({ 
  question, 
  answer, 
  list 
}: { 
  question: string; 
  answer: string; 
  list?: string[]; 
}) {
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
        <div className="pb-5 pr-8 space-y-3">
          <p className="text-slate-500 text-sm leading-relaxed">
            {answer}
          </p>

          {list && list.length > 0 && (
            <ul className="list-disc list-inside text-slate-500 text-sm space-y-1">
              {list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
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
          <FAQRow
            key={f.question}
            question={f.question}
            answer={f.answer}
            list={f.list}
          />
        ))}
      </div>
    </section>
  );
}