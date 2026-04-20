import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";

export function TourPage() {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const pricingRef = useRef(null);

  const scrollToPricing = () => {
    pricingRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const languageNames = {
    tr: "Turkish",
    en: "English",
    de: "German",
    ru: "Russian",
    ar: "Arabic",
    fr: "French",
    es: "Spanish",
    it: "Italian",
    ja: "Japanese",
  };

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const tour = await api.getTour(id);

        // Parse string data into arrays/objects
        const parsedTour = {
          ...tour,
          images: tour.images ? tour.images.split(",") : [],
          highlights: tour.highlights
            ? tour.highlights.split("\n").filter((h) => h.trim())
            : [],
          included: tour.included
            ? tour.included.split("\n").filter((i) => i.trim())
            : [],
          notIncluded: tour.not_included
            ? tour.not_included.split("\n").filter((n) => n.trim())
            : [],
          itinerary: tour.itinerary
            ? tour.itinerary
                .split("\n")
                .filter((i) => i.trim())
                .map((item, idx) => {
                  const parts = item.split("|").map((p) => p.trim());
                  return {
                    day: idx + 1,
                    title: parts[1] || "Day Activity",
                    description: parts[2] || "",
                  };
                })
            : [],
        };

        setTourData(parsedTour);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tour:", error);
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">{t("common.loading")}</div>
        </div>
      </div>
    );
  }

  if (!tourData) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Tour not found</div>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tourData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + tourData.images.length) % tourData.images.length,
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-30">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
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
          <span className="font-medium">{t("nav.tours")}</span>
        </button>

        {/* Image Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Image Slider */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              {tourData.images[currentImageIndex] &&
              tourData.images[currentImageIndex] !== "homepage-pic-1.jpg" ? (
                <img
                  src={tourData.images[currentImageIndex]}
                  alt={`Tour image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="w-24 h-24 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-lg font-semibold">No image uploaded</p>
                    <p className="text-sm">
                      Please upload tour images from admin panel
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
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
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
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

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {tourData.images.length}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {tourData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    idx === currentImageIndex
                      ? "border-amber-500 scale-105"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tour Info & Booking Card */}
          <div>
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24">
              <div className="mb-4">
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {tourData.destination}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tourData.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-gray-600">
                  <span className="font-semibold">🕐 {tourData.duration}</span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">
                    Pricing varies by group size
                  </p>
                  <p
                    onClick={scrollToPricing}
                    className="text-sm text-gray-500 cursor-pointer hover:text-amber-500 transition-colors duration-400"
                  >
                    See pricing details below
                  </p>
                  <button
                    onClick={() => navigate("/contact#contact")}
                    className="mt-4 w-full bg-linear-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    {t("common.bookNow")}
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"></div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{languageNames[tourData.language]} speaking guide</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Details Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("tours.overview")}
            </h2>
            <p className="text-gray-700 leading-relaxed">{tourData.overview}</p>
          </section>

          {/* Highlights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("tours.highlights")}
            </h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-30">
              {tourData.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-amber-500 text-xl">✦</span>
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("tours.included")}
            </h2>
            <div className="ml-2 md:ml-50 md:gap-x-55 grid grid-cols-2 mt-10 md:mt-0  md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">✓</span> {t("tours.included")}
                </h3>
                <ul className="space-y-2">
                  {tourData.included.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-green-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">✗</span> {t("tours.notIncluded")}
                </h3>
                <ul className="space-y-2">
                  {tourData.notIncluded.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-red-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Itinerary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t("tours.itinerary")}
            </h2>
            <div className="space-y-4">
              {tourData.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="border-l-4 border-amber-500 pl-6 pb-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-amber-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                      Day {day.day}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {day.title}
                    </h3>
                  </div>
                  <p className="text-gray-700">{day.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Table */}
          <section ref={pricingRef}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t("tours.price")}
            </h2>
            {tourData.pricing && tourData.pricing.length > 0 ? (
              <div className="space-y-4">
                {tourData.pricing.map((priceEntry, idx) => (
                  <div
                    key={priceEntry.id || idx}
                    className="border-l-4 border-green-500 pl-6 pb-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                        {priceEntry.min_persons}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {priceEntry.price_per_person}
                      </h3>
                      <span className="text-gray-600 text-sm">per person</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  Pricing information will be available soon.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please contact us for current rates.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Bottom Booking CTA */}
        <div className="mt-8 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-gray-600 mb-1">
              Don't miss out on this amazing experience!
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Contact us for the best rates based on your group size
            </p>
          </div>
          <button
            onClick={() => navigate("/contact#contact")}
            className="bg-linear-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            {t("common.bookNow")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
