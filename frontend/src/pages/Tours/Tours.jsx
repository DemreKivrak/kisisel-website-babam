import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { TourPage } from "../../components/TourPage";
import { api } from "../../services/api";
import { PageEnd } from "../../components/PageEnd";
import { WhatsappContact } from "../../components/WhatsappContact";

export function Tours() {
  const { t } = useTranslation();
  const location = useLocation();
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState(["All"]);
  const [availableLanguages, setAvailableLanguages] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const languageNames = {
    All: "All Languages",
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
    loadData();
  }, []);

  // Separate effect to watch for URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const languageParam = urlParams.get("language");
    if (languageParam) {
      setSelectedLanguage(languageParam);
    } else {
      setSelectedLanguage("All");
    }
  }, [location.search]);

  const loadData = async () => {
    try {
      const [toursData, destinationsData] = await Promise.all([
        api.getTours(),
        api.getDestinations(),
      ]);

      // Add default properties for tours
      const toursWithDefaults = toursData.map((tour) => {
        // Get first image from images field (comma-separated string)
        const firstImage = tour.images
          ? tour.images.split(",")[0].trim()
          : "homepage-pic-1.jpg";

        return {
          ...tour,
          img: firstImage,
          type: "Guaranteed Departured Tour",
        };
      });

      setTours(toursWithDefaults);

      // Build destinations list from unique tour destinations
      const uniqueDestinations = [
        "All",
        ...new Set(toursData.map((t) => t.destination)),
      ];
      setDestinations(uniqueDestinations);

      // Build languages list from unique tour languages
      const uniqueLanguages = [
        "All",
        ...new Set(toursData.map((t) => t.language || "tr")),
      ];
      setAvailableLanguages(uniqueLanguages);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter((tour) => {
    const matchesDestination =
      selectedDestination === "All" || tour.destination === selectedDestination;
    const matchesLanguage =
      selectedLanguage === "All" ||
      (tour.language || "tr") === selectedLanguage;

    // Debug logging
    if (selectedLanguage !== "All") {
      console.log(
        "Tour:",
        tour.name,
        "Language:",
        tour.language || "tr",
        "Selected:",
        selectedLanguage,
        "Matches:",
        matchesLanguage,
      );
    }

    return matchesDestination && matchesLanguage;
  });

  if (loading) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t("common.loading")}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <title>Tours</title>

      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 mt-5">
            {t("tours.allTours")}
          </h1>
          <p className="text-xl text-gray-600">
            Explore Turkey's most beautiful destinations with our curated tour
            packages
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Language Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Filter by Language:
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedLanguage === lang
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              >
                {languageNames[lang] || lang}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Filter by Destination:
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {destinations.map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedDestination === dest
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
            >
              {/* Tour Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={tour.img}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/*language badge*/}
                <div className="absolute top-3 right-3 bg-gradient-to-r from bg-orange-400 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {languageNames[tour.language]}
                </div>
              </div>

              {/* Tour Info */}
              <div className="p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  {tour.duration}
                </p>
                <h3 className="text-xl font-bold text-gray-900 uppercase mb-2">
                  {tour.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{tour.type}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm font-semibold text-amber-600">
                    📍 {tour.destination}
                  </span>
                  <button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all duration-300 text-sm font-semibold cursor-pointer"
                    onClick={() => navigate(`/tourpage/${tour.id}`)}
                  >
                    {t("tours.viewDetails")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500">
              No tours found for this destination
            </p>
          </div>
        )}
      </div>
      <WhatsappContact />
      <PageEnd />
    </div>
  );
}
