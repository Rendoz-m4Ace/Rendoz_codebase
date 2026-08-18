export default function RentCategory() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-orange-600 font-heading font-semibold text-sm tracking-wide">
          What can you rent
        </p>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-slate-800 mt-2">
          Almost anything you did <br />
          rather not own.
        </h2>
        <p className="text-gray-500 mt-2 max-w-xl text-sm">
          A few examples of what people could rent through Rendoz once it
          launches.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="border border-slate-800 rounded-[20px] overflow-hidden">
          <img
            src="/assets/images/vehicles.jpg"
            alt="Vehicles for rent"
            className="w-full h-60 object-cover rounded-[16px]"
          />
          <div className="p-4">
            <h3 className="font-heading font-bold text-slate-800 md:text-lg">Vehicles</h3>
            <p className="text-slate-800 text-xs md:text-sm mt-1">
              Cars, bikes, and more for travel, work, or adventure.
            </p>
          </div>
        </div>

        <div className="border border-slate-800 rounded-[20px] overflow-hidden">
          <img
            src="/assets/images/tools-and-equipment.jpg"
            alt="Tools & Equipment for rent"
            className="w-full h-60 object-cover rounded-[16px]"
          />
          <div className="p-4">
            <h3 className="font-heading font-bold text-slate-800 md:text-lg">Tools & Equipment</h3>
            <p className="text-slate-800 text-xs md:text-sm mt-1">
              Perfect for home projects, repairs, and professional work.
            </p>
          </div>
        </div>

        <div className="border border-slate-800 rounded-[20px] overflow-hidden">
          <img
            src="/assets/images/camera-and-photography.jpg"
            alt="Cameras & Photography for rent"
            className="w-full h-60 object-cover rounded-[16px]"
          />
          <div className="p-4">
            <h3 className="font-heading font-bold text-slate-800 md:text-lg">Cameras & Photography</h3>
            <p className="text-slate-800 text-xs md:text-sm mt-1">
              Rent cameras and photography equipment when you need them.
            </p>
          </div>
        </div>

        <div className="border border-slate-800 rounded-[20px] overflow-hidden">
          <img
            src="/assets/images/electronics.jpg"
            alt="Electronics for rent"
            className="w-full h-60 object-cover rounded-[16px]"
          />
          <div className="p-4">
            <h3 className="font-heading font-bold text-slate-800 md:text-lg">Electronics</h3>
            <p className="text-slate-800 text-xs md:text-sm mt-1">
              Laptops, speakers, consoles, and more for work or entertainment.
            </p>
          </div>
        </div>

        <div className="border border-slate-800 rounded-[20px] overflow-hidden">
          <img
            src="/assets/images/fashion.jpg"
            alt="Fashion for rent"
            className="w-full h-60 object-cover rounded-[16px]"
          />
          <div className="p-4">
            <h3 className="font-heading font-bold text-slate-800 md:text-lg">Fashion</h3>
            <p className="text-slate-800 text-xs md:text-sm mt-1">
              Rent all kinds of fashion items when you need them.
            </p>
          </div>
        </div>

        <div className="border border-slate-800 rounded-[20px] overflow-hidden">
          <img
            src="/assets/images/furniture.jpg"
            alt="Furniture for rent"
            className="w-full h-60 object-cover rounded-[16px]"
          />
          <div className="p-4">
            <h3 className="font-heading font-bold text-slate-800 md:text-lg">Furniture</h3>
            <p className="text-slate-800 text-xs md:text-sm mt-1">
              Furnish a space temporarily, no long-term commitment needed.
            </p>
          </div>
        </div>

        <div className="border border-slate-800 rounded-[20px] overflow-hidden">
          <img
            src="/assets/images/events.jpg"
            alt="Event for rent"
            className="w-full h-60 object-cover rounded-[16px]"
          />
          <div className="p-4">
            <h3 className="font-heading font-bold text-slate-800 md:text-lg">Event</h3>
            <p className="text-slate-800 text-xs md:text-sm mt-1">
              Get what you need for your next event without buying everything.
            </p>
          </div>
        </div>

        <div className="border border-slate-800 rounded-[20px] overflow-hidden">
          <img
            src="/assets/images/generator.jpg"
            alt="Generator for rent"
            className="w-full h-60 object-cover rounded-[16px]"
          />
          <div className="p-4">
            <h3 className="font-heading font-bold text-slate-800 md:text-lg">Generator</h3>
            <p className="text-slate-800 text-xs md:text-sm mt-1">
              Rent generator when you need them.
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-6 max-w-[420px] md:max-w-none">
        Examples of what could be available at launch — not a live catalog yet.
      </p>
    </section>
  );
}