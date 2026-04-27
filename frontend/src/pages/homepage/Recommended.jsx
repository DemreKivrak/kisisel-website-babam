import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";

export function Recommended() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const containerRef = useRef(null); // dış wrapper için yeni ref
  const intervalRef = useRef(null);

  const languageNames = {
    tr: "🇹🇷 Türkçe",
    en: "🇬🇧 English",
    de: "🇩🇪 Deutsch",
    ru: "🇷🇺 Русский",
    ar: "🇸🇦 العربية",
    fr: "🇫🇷 Français",
    es: "🇪🇸 Español",
    it: "🇮🇹 Italiano",
    ja: "🇯🇵 日本語",
  };

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      const data = await api.getTours();
      const recommendedTours = data.filter((tour) => tour.is_recommended);
      const toursWithDefaults = recommendedTours.map((tour) => ({
        id: tour.id,
        name: tour.name,
        img: tour.images ? tour.images.split(",")[0] : "homepage-pic-1.jpg",
        price: tour.price,
        info: tour.duration || "tour info",
        language: tour.language || "tr",
      }));
      setRecommended(toursWithDefaults.slice(0, 10));
    } catch (error) {
      console.error("Error loading tours:", error);
      setRecommended([]);
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
  const startAutoScroll = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 400, behavior: "smooth" });
      }
    }, 2000);
  };

  // Auto-scroll: görünürlük takibi
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAutoScroll();
        } else {
          clearInterval(intervalRef.current);
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      clearInterval(intervalRef.current);
    };
  }, [recommended]);

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
    <div
      ref={containerRef}
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() => startAutoScroll()}
      className="py-4 px-4 bg-gradient-to-b from-white to-amber-50/30 overflow-hidden "
    >
      <div className="text-center mb-6 relative">
        <span className="absolute inset-0 flex items-center justify-center text-[8rem] md:text-[12rem] font-black text-gray-100 select-none pointer-events-none leading-none -z-10">
          02
        </span>
        <p className="text-amber-500 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
          {t("tours.handpicked")}
        </p>
        <h1 className="text-4xl md:text-5xl font-onest font-bold tracking-tight text-gray-900  leading-relaxed mb-6 ">
          {t("tours.recommended")}
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          {t("tours.recommendedSubtitle")}
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative px-2 md:px-0">
        {/* Sol Ok */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
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
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-2 snap-x snap-mandatory "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recommended.map((tour, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex-shrink-0 w-[80vw] max-w-[280px] md:w-[calc(25%-1.125rem)] md:max-w-none snap-center flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={tour.img}
                  alt={tour.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-sky-400 to-sky-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-10">
                  {languageNames[tour.language]}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Recommended Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {t("tours.recommendedBadge")}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col flex-1">
                {/* Duration Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {tour.info}
                  </div>
                </div>

                {/* Tour Name */}
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                  {tour.name}
                </h3>

                {/* Features */}
                <div className="space-y-1 mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600"></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t("tours.expertGuide")}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate(`/tourpage/${tour.id}`)}
                  className="mt-auto w-4/7 bg-gradient-to-r from-[rgb(36,54,61)] to-[rgb(49,76,88)] text-white py-2 rounded-3xl font-medium  transition-all duration-400 flex items-center justify-center gap-2 shadow-md group-hover:shadow-lg cursor-pointer mx-auto hover:bg-white hover:bg-none hover:text-[rgb(31,37,40)] hover:border-1 "
                >
                  <span>{t("tours.viewDetails")}</span>
                </button>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Sağ Ok */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
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
