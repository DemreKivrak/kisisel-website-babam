import { useState } from "react";

export function Recommended() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const recommended = [
    {
      name: "Tour name-1",
      img: "homepage-pic-1.jpg ",
      price: "100 €",
      info: "tour info",
    },
    {
      name: "Tour name-2",
      img: "homepage-pic-1.jpg",
      price: "200 €",
      info: "tour info",
    },
    {
      name: "Tour name-3",
      img: "homepage-pic-1.jpg",
      price: "300 €",
      info: "tour info",
    },
  ];
  return (
    <>
      <div className="py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Recommended Tours
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

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
              {recommended.map((dest, i) => (
                <div key={i} className="min-w-full px-4">
                  <div className="relative bg-gray-300 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={dest.img}
                      alt={dest.name}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-24 right-4 px-4 py-2 z-10">
                      <p className="text-sm text-white drop-shadow-lg">
                        Starting From
                      </p>
                      <p className="text-3xl font-bold text-white drop-shadow-lg">
                        {dest.price}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {dest.info}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 uppercase mt-1">
                        {dest.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Guaranteed Departured Tours
                      </p>
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
                Math.min(recommended.length - 1, prev + 1)
              )
            }
            disabled={currentIndex === recommended.length - 1}
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
            {recommended.map((_, i) => (
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
    </>
  );
}
