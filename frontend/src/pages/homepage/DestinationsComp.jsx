import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";

export function DestinationsComp() {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const data = await api.getDestinations();
      setDestinations(data.slice(0, 10));
    } catch (error) {
      console.error("Error loading destinations:", error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 overflow-hidden">
      <div className="text-center mb-12">
        <div className="inline-block px-4">
          <span className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-2 block">
            {t("destinations.discover")}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900  to-gray-900 bg-clip-text text-transparent mb-5 font-serif">
            {t("destinations.popularTitle")}
          </h1>
          <div className="w-32 md:w-150 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full"></div>
        </div>
        <p className="mt-6 text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
          {t("destinations.popularSubtitle")}
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative px-2 md:px-0">
        {/* Sol Ok */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-12 py-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {destinations.map((dest, i) => (
            <div
              key={i}
              onClick={() => navigate(`/destinations#${dest.id}`)}
              className="group relative flex-shrink-0 w-[280px] md:w-80 overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 snap-center"
            >
              {/* Image Container */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Animated Corner Badge */}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl font-bold text-white mb-2 transform group-hover:translate-x-2 transition-transform duration-300">
                  {dest.name}
                </h3>
                <div className="flex items-center gap-2 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {t("destinations.exploreMore")} →
                  </span>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-4 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Sağ Ok */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
