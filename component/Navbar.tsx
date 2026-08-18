export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="font-bold text-xl">
        R<span className="text-orange-500">endoz</span>
      </div>
      <ul className="hidden md:flex gap-6 text-sm text-gray-700">
        <li>How It Works</li>
        <li>For Renters</li>
        <li>For Owners</li>
        <li>About</li>
      </ul>
      <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full">
        Join the waitlist
      </button>
    </nav>
  );
}

