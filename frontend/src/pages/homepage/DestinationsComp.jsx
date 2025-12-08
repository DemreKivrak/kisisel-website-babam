import { useState } from "react";

export function DestinationsComp() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const destinations = [
    { name: "Destination-1", img: "homepage-pic-1.jpg" },
    { name: "Destination-2", img: "homepage-pic-1.jpg" },
    { name: "Destination-3", img: "homepage-pic-1.jpg" },
  ];

  return (
    <div className="py-8 px-4 w-160">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-500">
        Destinations
      </h1>

      <div className="relative max-w-4xl mx-auto">
        {/* Sol Ok */}
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Slider Container */}
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {destinations.map((dest, i) => (
              <div key={i} className="min-w-full px-4">
                <div className="relative bg-gray-300 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-4xl font-bold text-white">
                      {dest.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Ok */}
        <button
          onClick={() =>
            setCurrentIndex((prev) =>
              Math.min(destinations.length - 1, prev + 1)
            )
          }
          disabled={currentIndex === destinations.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {destinations.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === currentIndex ? "bg-gray-800" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
