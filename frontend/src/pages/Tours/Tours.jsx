import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { TourPage } from "../../components/TourPage";
import { api } from "../../services/api";
import { Footer } from "../../components/Footer";
import { WhatsappContact } from "../../components/WhatsappContact";

export function Tours() {
  const { t } = useTranslation();
  const location = useLocation();
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState(["All"]);
  const [availableLanguages, setAvailableLanguages] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const languageNames = {
    All: t("tours.allLanguages"),
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

  const filteredTours = tours
    .filter((tour) => {
      const matchesDestination =
        selectedDestination === "All" ||
        tour.destination === selectedDestination;
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
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return b.id - a.id;
      if (sortOrder === "oldest") return a.id - b.id;
      return 0;
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
          <p className="text-xl text-gray-600">{t("tours.exploreSubtitle")}</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overlay to close dropdowns on outside click */}
        {openDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenDropdown(null)}
          />
        )}

        <div className="max-w-3xl flex flex-col sm:flex-row gap-3 mb-8 mx-auto">
          {/* Language Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "language" ? null : "language")
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <span>{languageNames[selectedLanguage] || selectedLanguage}</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown === "language" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openDropdown === "language" && (
              <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {availableLanguages.map((lang) => (
                  <div
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setOpenDropdown(null);
                    }}
                    className={`px-4 py-2.5 cursor-pointer hover:bg-amber-50 text-gray-700 transition-colors ${selectedLanguage === lang ? "bg-amber-50 font-semibold text-amber-600" : ""}`}
                  >
                    {languageNames[lang] || lang}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Destination Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "destination" ? null : "destination",
                )
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <span>
                {selectedDestination === "All"
                  ? t("tours.allDestinations")
                  : selectedDestination}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown === "destination" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openDropdown === "destination" && (
              <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {destinations.map((dest) => (
                  <div
                    key={dest}
                    onClick={() => {
                      setSelectedDestination(dest);
                      setOpenDropdown(null);
                    }}
                    className={`px-4 py-2.5 cursor-pointer hover:bg-amber-50 text-gray-700 transition-colors ${selectedDestination === dest ? "bg-amber-50 font-semibold text-amber-600" : ""}`}
                  >
                    {dest === "All" ? t("tours.allDestinations") : dest}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "sort" ? null : "sort")
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <span>
                {sortOrder === "newest"
                  ? t("tours.newestFirst")
                  : t("tours.oldestFirst")}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown === "sort" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openDropdown === "sort" && (
              <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {[
                  { value: "newest", label: t("tours.newestFirst") },
                  { value: "oldest", label: t("tours.oldestFirst") },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      setSortOrder(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={`px-4 py-2.5 cursor-pointer hover:bg-amber-50 text-gray-700 transition-colors ${sortOrder === opt.value ? "bg-amber-50 font-semibold text-amber-600" : ""}`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/*search bar */}
          <div className="flex items-end">
            <div
              className={`flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                searchOpen
                  ? "w-56 px-3 "
                  : "w-12 px-0 cursor-pointer justify-center !rounded-full"
              }`}
              style={{ height: "52px" }}
              onClick={() => !searchOpen && setSearchOpen(true)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchOpen((prev) => !prev);
                }}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
              >
                <img
                  src="/icons8-search-30.png"
                  className="w-6 h-6 opacity-80 cursor-pointer"
                />
              </button>
              {searchOpen && (
                <input
                  autoFocus
                  type="text"
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                  onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                  className="ml-2 flex-1 bg-transparent focus:outline-none text-gray-700 text-sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col"
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
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  {tour.duration}
                </p>
                <h3 className="text-xl font-bold text-gray-900 uppercase mb-2">
                  {tour.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{tour.type}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
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
            <p className="text-2xl text-gray-500">{t("tours.noToursFound")}</p>
          </div>
        )}
      </div>
      <WhatsappContact />
      <Footer />
    </div>
  );
}
