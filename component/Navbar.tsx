import Image from "next/image";
export default function Navbar() {
  return (
    <nav className="flex font-['Inter'] h-12 items-center justify-between border-b border-white/30 bg-[#D9E0EB] px-6">
      
      <div className="">
        <Image src="/images/logo.png" alt="RendOz logo" width={120} height={32} />
      </div>
      <ul className="font-normal text-base leading-[140%] hidden items-center gap-10  text-black md:flex">
        <li>About</li>
        <li>For Renters &amp; Owners</li>
        <li>How it works</li>
        <li>FAQ</li>
      </ul>
      <button className="rounded-full w-123px h-22px bg-orange-500 px-4 py-1.5 text-base leading-[140%] font-semibold font-normal text-white">
        Join the waitlist
      </button>
    </nav>
  )}

 


