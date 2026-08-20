export default function Navbar() {
  return (
    <nav className="flex h-12 items-center justify-between border-b border-white/30 bg-[#dfe3f3] px-6">
      <div className="font-bold text-sm text-slate-800">
        R<span className="text-orange-500">endoz</span>
      </div>
      <ul className="hidden items-center gap-5 text-[9px] text-slate-800 md:flex">
        <li>About</li>
        <li>For Renters &amp; Owners</li>
        <li>How it works</li>
        <li>FAQ</li>
      </ul>
      <button className="rounded-full bg-orange-500 px-4 py-1.5 text-[10px] font-semibold text-white">
        Join the waitlist
      </button>
    </nav>
  )}