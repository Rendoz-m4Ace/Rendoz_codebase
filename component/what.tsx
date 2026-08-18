export default function What() {
  return (
    <section className="py-16 px-6 bg-slate-50">
    {/* bg-slate-50 = very light gray background
        py-16 = padding top and bottom
        px-6 = padding left and right */}

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
      {/* grid md:grid-cols-2 = two columns on medium screens
          items-center = vertically center both sides */}

        {/* LEFT SIDE - Text */}
        <div>
          <p className="text-orange-500 text-xs font-semibold uppercase tracking-wide mb-2">
            {/* uppercase = all caps
                tracking-wide = letter spacing */}
            What is Rendoz
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            A simpler way to access the things you need.
          </h2>

          <p className="text-slate-600 mb-6">
            Rendoz is a rental marketplace where people can discover items available for rent, choose how long they need them, and return them when they're done.
          </p>

          <div className="border-l-4 border-orange-500 pl-4">
          {/* border-l-4 = left border 4px thick
              border-orange-500 = orange color
              pl-4 = padding left */}
            <p className="text-slate-700 font-medium italic">
              You don't always need to own something. Sometimes you just need to use it.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Rendoz Diagram */}
        <div className="flex items-center justify-center">
        {/* flex items-center justify-center = center the diagram */}

          <div className="relative w-64 h-64">
          {/* relative = for positioning children
              w-64 h-64 = fixed size circle area */}

            {/* Outer circle */}
            <div className="w-64 h-64 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
            {/* rounded-full = perfect circle
                border-2 = 2px border
                border-dashed = dashed style
                border-gray-300 = light gray */}

              {/* Center Logo */}
              <div className="text-center">
                <span className="text-orange-500 text-4xl font-bold">R</span>
                <p className="text-slate-900 font-bold text-xl">endoz</p>
              </div>
            </div>

            {/* Top label - Renters */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-slate-600 shadow">
            {/* absolute = positioned relative to parent
                left-1/2 -translate-x-1/2 = horizontally centered
                -translate-y-4 = moved up
                rounded-full = pill shape */}
              Renters
            </div>

            {/* Bottom label - Owners */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-slate-600 shadow">
              Owners
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}