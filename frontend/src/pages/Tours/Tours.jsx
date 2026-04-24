import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { TourPage } from "../../components/TourPage";
import { api } from "../../services/api";
import { Footer } from "../../components/Footer";
import { WhatsappContact } from "../../components/WhatsappContact";
import { motion, AnimatePresence } from "framer-motion";

export function Tours() {
  const { t, i18n } = useTranslation();
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

  // Separate effect to watch for URL changes and i18n language
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const languageParam = urlParams.get("language");
    if (languageParam) {
      setSelectedLanguage(languageParam);
    } else {
      setSelectedLanguage(i18n.language);
    }
  }, [location.search, i18n.language]);

  const resetFilters = () => {
    setSelectedDestination("All");
    setSelectedLanguage("All");
    setSortOrder("newest");
    setSearchQuery("");
  };

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
      const matchesSearch =
        !searchQuery ||
        tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destination.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDestination && matchesLanguage && matchesSearch;
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

      {/* Mobil filtre butonu - sadece küçük ekranlarda görünür */}
      <div className="flex md:hidden gap-2 mb-4 px-4 mt-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center gap-2 font-medium text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          <span>Filter</span>
          {(selectedDestination !== "All" || selectedLanguage !== "All") && (
            <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">
              {
                [
                  selectedDestination !== "All",
                  selectedLanguage !== "All",
                ].filter(Boolean).length
              }
            </span>
          )}
        </button>
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl shadow-sm px-3">
          <img
            src="/icons8-search-30.png"
            className="w-5 h-5 opacity-60 flex-shrink-0"
          />
          <input
            type="text"
            placeholder="Search tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 flex-1 bg-transparent focus:outline-none text-gray-700 text-sm py-3"
          />
        </div>
      </div>

      {/* Filter Section - sadece md+ ekranlarda göster */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overlay to close dropdowns on outside click */}
        {openDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenDropdown(null)}
          />
        )}

        <div className="hidden md:flex max-w-3xl flex-row gap-3 mb-8 mx-auto">
          {/* Language Dropdown */}
          <div className="relative md:flex-1">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "language" ? null : "language")
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
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
            <AnimatePresence>
              {openDropdown === "language" && (
                <motion.div
                  key="language"
                  className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg"
                  style={{ maxHeight: "240px", overflowY: "auto" }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Destination Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "destination" ? null : "destination",
                )
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
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
            <AnimatePresence>
              {openDropdown === "destination" && (
                <motion.div
                  key="destination"
                  className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg"
                  style={{ maxHeight: "240px", overflowY: "auto" }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "sort" ? null : "sort")
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
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
            <AnimatePresence>
              {openDropdown === "sort" && (
                <motion.div
                  key="sort"
                  className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg"
                  style={{ maxHeight: "240px", overflowY: "auto" }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
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
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setMobileFilterOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              key="panel"
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 md:hidden shadow-2xl h-screen overflow-y-auto "
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  setMobileFilterOpen(false);
                }
              }}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold mb-4">Filter & Order</h3>

              {/* Language */}
              <div className="mb-4">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === "mob-language" ? null : "mob-language",
                    )
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium flex justify-between items-center"
                >
                  <span>
                    {languageNames[selectedLanguage] || selectedLanguage}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown === "mob-language" ? "rotate-180" : ""}`}
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
                {openDropdown === "mob-language" && (
                  <div className="border border-gray-200 rounded-xl mt-1 overflow-hidden">
                    {availableLanguages.map((lang) => (
                      <div
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setOpenDropdown(null);
                        }}
                        className={`px-4 py-2.5 cursor-pointer hover:bg-amber-50 text-gray-700 ${selectedLanguage === lang ? "bg-amber-50 font-semibold text-amber-600" : ""}`}
                      >
                        {languageNames[lang] || lang}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="mb-4">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === "mob-destination"
                        ? null
                        : "mob-destination",
                    )
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium flex justify-between items-center"
                >
                  <span>
                    {selectedDestination === "All"
                      ? t("tours.allDestinations")
                      : selectedDestination}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown === "mob-destination" ? "rotate-180" : ""}`}
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
                {openDropdown === "mob-destination" && (
                  <div className="border border-gray-200 rounded-xl mt-1 overflow-hidden">
                    {destinations.map((dest) => (
                      <div
                        key={dest}
                        onClick={() => {
                          setSelectedDestination(dest);
                          setOpenDropdown(null);
                        }}
                        className={`px-4 py-2.5 cursor-pointer hover:bg-amber-50 text-gray-700 ${selectedDestination === dest ? "bg-amber-50 font-semibold text-amber-600" : ""}`}
                      >
                        {dest === "All" ? t("tours.allDestinations") : dest}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort */}
              <div className="mb-6 pb-20">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === "mob-sort" ? null : "mob-sort",
                    )
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium flex justify-between items-center"
                >
                  <span>
                    {sortOrder === "newest"
                      ? t("tours.newestFirst")
                      : t("tours.oldestFirst")}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown === "mob-sort" ? "rotate-180" : ""}`}
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
                {openDropdown === "mob-sort" && (
                  <div className="border border-gray-200 rounded-xl mt-1 overflow-hidden">
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
                        className={`px-4 py-2.5 cursor-pointer hover:bg-amber-50 text-gray-700 ${sortOrder === opt.value ? "bg-amber-50 font-semibold text-amber-600" : ""}`}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/*buttons */}
              <div className="flex gap-x-2 fixed bottom-4 left-0 right-0 px-6">
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-gray-400 text-white py-3 rounded-3xl flex-1 font-semibold"
                >
                  CLEAR
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className=" flex-2 w-full bg-amber-500 text-white py-3 rounded-3xl font-semibold"
                >
                  APPLY
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <WhatsappContact />
      <Footer />
    </div>
  );
}
