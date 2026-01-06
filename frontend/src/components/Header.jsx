import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useMenu } from "../contexts/MenuContext";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isOnTop, setIsOnTop] = useState(true);
  const [destinations, setDestinations] = useState([]);
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

    loadDestinations();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-10">
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
        <p className="text-white">
          +90 532 231 57 58 | yukselkivrak@hotmail.com
        </p>
      </div>
      {/* Main Header */}
      <div
        className={`absolute left-0 w-full max-w-[100vw] flex items-center bg-gray-500/50 h-20 md:h-26 transition-all duration-300 ${
          !isOnTop ? "top-0 bg-white" : "md:top-10 top-0"
        }`}
      >
        {/* Logo */}
        <img
          className="cursor-pointer h-12 md:h-24 ml-2 md:ml-10 flex-shrink-0"
          src="logo-2-new.png"
          alt="logo"
          onClick={() => handleNavigate("/")}
        />

        {/* Hamburger Button - Mobile Only */}
        <button
          className={`md:hidden ml-auto mr-2 flex flex-col gap-1.5 p-2 flex-shrink-0 ${
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

        {/* Desktop Menu */}
        <div
          className={`hidden md:flex ml-10 lg:ml-35 items-center text-[17px] gap-6 lg:gap-15 ${
            !isOnTop ? "text-black" : "text-white"
          }`}
        >
          {/*menu items*/}
          <a
            className="hover:text-amber-300 cursor-pointer transition"
            onClick={() => handleNavigate("/")}
          >
            Home
          </a>
          <div className="relative group">
            <a
              className="hover:text-amber-300 cursor-pointer transition flex items-center gap-1"
              onClick={() => navigate("/tours")}
            >
              Tours
            </a>
          </div>

          <div className="relative group">
            <a
              className="hover:text-amber-300 cursor-pointer transition flex items-center gap-1"
              onClick={() => navigate("/destinations")}
            >
              Destinations
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
              Services
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
                <a className="block w-full">Car Rental</a>
              </li>
            </ul>
          </div>

          <a
            className="hover:text-amber-300 cursor-pointer transition"
            onClick={() => navigate("/contact")}
          >
            Contact
          </a>

          <div className="relative group">
            <a className="hover:text-amber-300 cursor-pointer transition flex items-center gap-1">
              About
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
                <a className="block w-full">About us</a>
              </li>
              <li
                className=" px-4 py-2 cursor-pointer transition hover:text-amber-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/galery");
                }}
              >
                <a className="block w-full">Gallery</a>
              </li>
            </ul>
          </div>
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
            Home
          </a>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/tours")}
          >
            Tours
          </a>
          <div>
            <div
              className="px-6 py-3 ml-6 hover:bg-gray-100 cursor-pointer transition text-gray-800"
              onClick={() => setMobileDestinationsOpen(!mobileDestinationsOpen)}
            >
              Destinations
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
            Services
          </a>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/contact")}
          >
            Contact
          </a>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/about")}
          >
            About us
          </a>
          <a
            className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition text-gray-800"
            onClick={() => handleNavigate("/galery")}
          >
            Gallery
          </a>
        </nav>
      </div>
    </div>
  );
}
