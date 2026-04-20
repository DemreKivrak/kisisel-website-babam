import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", countryCode: "gb" },
    { code: "tr", name: "Türkçe", countryCode: "tr" },
    { code: "de", name: "Deutsch", countryCode: "de" },
    { code: "fr", name: "Français", countryCode: "fr" },
    { code: "es", name: "Español", countryCode: "es" },
    { code: "ru", name: "Русский", countryCode: "ru" },
    { code: "ja", name: "日本語", countryCode: "jp" },
  ];
  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //close dropdown with scroll

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 cursor-pointer"
        aria-label="Select Language"
      >
        <img
          src={`https://flagcdn.com/w20/${currentLanguage.countryCode}.png`}
          alt={currentLanguage.name}
          className="w-5 h-4 object-cover rounded-sm"
        />
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full px-4 py-2.5 text-left hover:bg-amber-50 transition-colors flex items-center gap-3 cursor-pointer ${
                i18n.language === lang.code
                  ? "bg-amber-50 text-amber-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              <img
                src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                alt={lang.name}
                className="w-7 h-5 object-cover rounded-sm"
              />
              <span className="text-sm">{lang.name}</span>
              {i18n.language === lang.code && (
                <svg
                  className="w-5 h-5 ml-auto text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
