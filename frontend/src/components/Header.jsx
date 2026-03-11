import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useMenu } from "../contexts/MenuContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isOnTop, setIsOnTop] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [toursByLanguage, setToursByLanguage] = useState({});
  const [mobileDestinationsOpen, setMobileDestinationsOpen] = useState(false);
  const { mobileMenuOpen, setMobileMenuOpen } = useMenu();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsVisible(false);
        setIsOnTop(false);
      } else {
        setIsVisible(true);
        setIsOnTop(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Error loading destinations:", error);
      }
    };

    const loadTours = async () => {
      try {
        const allTours = await api.getTours();

        // Group tours by language
        const grouped = allTours.reduce((acc, tour) => {
          const lang = tour.language || "tr";
          if (!acc[lang]) {
            acc[lang] = [];
          }
          acc[lang].push(tour);
          return acc;
        }, {});

        setToursByLanguage(grouped);
      } catch (error) {
        console.error("Error loading tours:", error);
      }
    };

    loadDestinations();
    loadTours();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Top Contact Bar - Hidden on mobile */}
      <div
        className={`bg-gray-500/50 h-10 hidden md:flex items-center text-[12px] border-b border-gray-200 transition-all duration-300 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <img
          className="h-5 ml-5 mr-2"
          src="icons8-phone-24.png"
          alt="phone"
        ></img>
        <p className="text-white">+90 536 223 83 40 | oltretour@hotmail.com</p>
      </div>
      {/* Main Header */}
      <div
        className={`absolute left-0 w-full max-w-[100vw] flex items-center justify-between bg-gray-500/50 h-20 md:h-26 transition-all duration-300 ${
          !isOnTop ? "top-0 bg-white" : "md:top-10 top-0"
        }`}
      >
        {/* Logo */}
        <div>
          <img
            className="cursor-pointer h-12 md:h-24 ml-2 md:ml-10 flex-shrink-0 md:mb-1"
            src="new-logo-oltre.png"
            alt="logo"
            onClick={() => handleNavigate("/")}
          />
        </div>

        {/* Desktop Menu - Center */}
        <div
          className={`hidden md:flex items-center text-[17px] gap-6 lg:gap-10 ${
            !isOnTop ? "text-black" : "text-white"
          }`}
        >
          {/*menu items*/}
          <a
            className="hover:text-amber-300 cursor-pointer transition"
            onClick={() => handleNavigate("/")}
          >
            {t("nav.home")}
          </a>
          <div className="relative group">
            <a
              className="hover:text-amber-300 cursor-pointer transition flex items-center gap-1"
              onClick={() => navigate("/tours")}
            >
              {t("nav.tours")}
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
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
            </a>
            <ul className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 bg-gray-50 text-gray-800 shadow-lg rounded-md mt-2 min-w-[250px] py-2 z-50 border-1 border-gray-200">
              {Object.keys(toursByLanguage).length > 0 ? (
                <>
                  {toursByLanguage["tr"] &&
                    toursByLanguage["tr"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=tr");
                        }}
                      >
                        🇹🇷 Türkçe Turlar ({toursByLanguage["tr"].length})
                      </li>
                    )}
                  {toursByLanguage["en"] &&
                    toursByLanguage["en"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=en");
                        }}
                      >
                        🇬🇧 English Tours ({toursByLanguage["en"].length})
                      </li>
                    )}
                  {toursByLanguage["de"] &&
                    toursByLanguage["de"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=de");
                        }}
                      >
                        🇩🇪 Deutsche Touren ({toursByLanguage["de"].length})
                      </li>
                    )}
                  {toursByLanguage["ru"] &&
                    toursByLanguage["ru"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=ru");
                        }}
                      >
                        🇷🇺 Русские туры ({toursByLanguage["ru"].length})
                      </li>
                    )}
                  {toursByLanguage["ar"] &&
                    toursByLanguage["ar"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=ar");
                        }}
                      >
                        🇸🇦 جولات عربية ({toursByLanguage["ar"].length})
                      </li>
                    )}
                  {toursByLanguage["fr"] &&
                    toursByLanguage["fr"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=fr");
                        }}
                      >
                        🇫🇷 Circuits français ({toursByLanguage["fr"].length})
                      </li>
                    )}
                  {toursByLanguage["es"] &&
                    toursByLanguage["es"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=es");
                        }}
                      >
                        🇪🇸 Tours en español ({toursByLanguage["es"].length})
                      </li>
                    )}
                  {toursByLanguage["it"] &&
                    toursByLanguage["it"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=it");
                        }}
                      >
                        🇮🇹 Tour italiani ({toursByLanguage["it"].length})
                      </li>
                    )}
                  {toursByLanguage["ja"] &&
                    toursByLanguage["ja"].length > 0 && (
                      <li
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/tours?language=ja");
                        }}
                      >
                        🇯🇵 日本語ツアー ({toursByLanguage["ja"].length})
                      </li>
                    )}
                  <li className="border-t border-gray-200 mt-1 pt-1">
                    <a
                      className="block px-4 py-2 hover:bg-amber-50 cursor-pointer transition font-semibold text-amber-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/tours");
                      }}
                    >
                      View All Tours →
                    </a>
                  </li>
                </>
              ) : (
                <li className="px-4 py-2 text-gray-500">No tours available</li>
              )}
            </ul>
          </div>

          <div className="relative group">
            <a
              className="hover:text-amber-300 cursor-pointer transition flex items-center gap-1"
              onClick={() => navigate("/destinations")}
            >
              {t("nav.destinations")}
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
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
            </a>
            <ul
              className=" invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 bg-gray-50 text-gray-800 shadow-lg rounded-md mt-2 min-w-[200px] py-2 z-50 border-1 border-gray-200
            
            "
            >
              {destinations.map((dest) => (
                <li
                  key={dest.id}
                  className=" px-4 py-2 cursor-pointer transition hover:text-amber-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/destinations#${dest.id}`);
                  }}
                >
                  <a className="block w-full">{dest.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <a
              className="hover:text-amber-300 cursor-pointer transition flex items-center gap-1"
              onClick={() => navigate("/services")}
            >
              {t("nav.services")}
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
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
            </a>
            <ul className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 bg-gray-50 text-gray-800 shadow-lg rounded-md mt-2 min-w-[200px] py-2 z-50 border-1 border-gray-200">
              <li
                className=" px-4 py-2 cursor-pointer transition hover:text-amber-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/services");
                }}
              >
                <a className="block w-full">{t("nav.carRental")}</a>
              </li>
            </ul>
          </div>

          <a
            className="hover:text-amber-300 cursor-pointer transition"
            onClick={() => navigate("/contact")}
          >
            {t("nav.contact")}
          </a>

          <div className="relative group">
            <a className="hover:text-amber-300 cursor-pointer transition flex items-center gap-1">
              {t("nav.about")}
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
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
            </a>
            <ul className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 bg-gray-50 text-gray-800 shadow-lg rounded-md mt-2 min-w-[200px] py-2 z-50 border-1 border-gray-200">
              <li
                className=" px-4 py-2 cursor-pointer transition hover:text-amber-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/about");
                }}
              >
                <a className="block w-full">{t("nav.about")}</a>
              </li>
              <li
                className=" px-4 py-2 cursor-pointer transition hover:text-amber-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/galery");
                }}
              >
                <a className="block w-full">{t("nav.gallery")}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right side - Language Switcher & Mobile Menu Button */}
        <div className="flex items-center gap-4 mr-4 md:mr-10">
          {/* Language Switcher - Desktop & Mobile */}
          <div className={!isOnTop ? "text-black" : "text-white"}>
            <LanguageSwitcher />
          </div>

          {/* Hamburger Button - Mobile Only */}
          <button
            className={`md:hidden flex flex-col gap-1.5 p-2 flex-shrink-0 ${
              !isOnTop ? "text-black" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span
              className={`w-6 h-0.5 bg-current transition-transform ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-current transition-opacity ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-current transition-transform ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-20 left-0 w-full bg-white shadow-lg transition-all duration-300 ${
          mobileMenuOpen
            ? "max-h-[calc(100vh-5rem)] opacity-100"
            : "max-h-0 opacity-0"
        } overflow-y-auto overflow-x-hidden`}
      >
        <nav className="flex flex-col py-4">
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/")}
          >
            {t("nav.home")}
          </a>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/tours")}
          >
            {t("nav.tours")}
          </a>
          <div>
            <div
              className="px-6 py-3 ml-6 hover:bg-gray-100 cursor-pointer transition text-gray-800"
              onClick={() => setMobileDestinationsOpen(!mobileDestinationsOpen)}
            >
              {t("nav.destinations")}
              <svg
                className={`w-4 h-4 inline-block ml-2 transition-transform ${
                  mobileDestinationsOpen ? "rotate-180" : ""
                }`}
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
            </div>
            {mobileDestinationsOpen && destinations.length > 0 && (
              <div className="bg-gray-50">
                {destinations.map((dest) => (
                  <a
                    key={dest.id}
                    className="block px-12 py-2 hover:bg-gray-100 cursor-pointer transition text-gray-600 text-sm"
                    onClick={() => handleNavigate(`/destinations#${dest.id}`)}
                  >
                    {dest.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/services")}
          >
            {t("nav.services")}
          </a>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/contact")}
          >
            {t("nav.contact")}
          </a>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/about")}
          >
            {t("nav.about")}
          </a>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/galery")}
          >
            {t("nav.gallery")}
          </a>
        </nav>
      </div>
    </div>
  );
}
