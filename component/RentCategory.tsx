export default function RentCategory() {
  const categories = [
    {
      src: "/assets/images/vehicles.jpg",
      alt: "Vehicles for rent",
      title: "Vehicles",
      desc: "Cars, bikes, and more for travel, work, or adventure.",
    },
    {
      src: "/assets/images/tools-and-equipment.jpg",
      alt: "Tools & Equipment for rent",
      title: "Tools & Equipment",
      desc: "Perfect for home projects, repairs, and professional work.",
    },
    {
      src: "/assets/images/camera-and-photography.jpg",
      alt: "Cameras & Photography for rent",
      title: "Cameras & Photography",
      desc: "Rent cameras and photography equipment when you need them.",
    },
    {
      src: "/assets/images/electronics.jpg",
      alt: "Electronics for rent",
      title: "Electronics",
      desc: "Laptops, speakers, consoles, and more for work or entertainment.",
    },
    {
      src: "/assets/images/fashion.jpg",
      alt: "Fashion for rent",
      title: "Fashion",
      desc: "Rent all kinds of fashion items when you need them.",
    },
    {
      src: "/assets/images/furniture.jpg",
      alt: "Furniture for rent",
      title: "Furniture",
      desc: "Furnish a space temporarily, no long-term commitment needed.",
    },
    {
      src: "/assets/images/events.jpg",
      alt: "Event for rent",
      title: "Event",
      desc: "Get what you need for your next event without buying everything.",
    },
    {
      src: "/assets/images/generator.jpg",
      alt: "Generator for rent",
      title: "Generator",
      desc: "Rent a generator when you need one.",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 py-12 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <p className="text-orange-600 font-semibold text-sm tracking-wide">
            What can you rent
          </p>
          <h2 className="font-bold text-2xl sm:text-3xl text-slate-800 mt-2 leading-tight">
            Almost anything you&apos;d{" "}
            <span className="block sm:inline">rather not own.</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            A few examples of what people could rent through Rendoz once it launches.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="border border-slate-800 rounded-[16px] sm:rounded-[20px] overflow-hidden"
            >
              <img
                src={cat.src}
                alt={cat.alt}
                className="w-full h-36 sm:h-48 md:h-52 lg:h-60 object-cover"
              />
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base md:text-lg leading-snug">
                  {cat.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-xs sm:text-sm mt-6">
          Examples of what could be available at launch — not a live catalog yet.
        </p>
      </div>
    </section>
  );
}
