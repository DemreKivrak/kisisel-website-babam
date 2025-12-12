import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isOnTop, setIsOnTop] = useState(true);
  const [destinations, setDestinations] = useState([]);
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

  return (
    <div className="fixed top-0 left-0 w-full z-10">
      <div
        className={`bg-gray-500/70 h-10 flex items-center text-[12px] border-b border-gray-200 transition-all duration-300 ${
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
          +90 531 795 40 75 | info@gurtour.com | Gurtour Travel Agency
        </p>
      </div>
      <div
        className={`absolute left-0 w-full flex items-center bg-gray-500/70 h-26 transition-all duration-300 ${
          !isOnTop ? "top-0 bg-white" : "top-10"
        }`}
      >
        <img
          className="h-12 ml-5 cursor-pointer"
          src="logo1.png"
          alt="logo"
          onClick={() => navigate("/")}
        />

        <div
          className={`ml-30 flex items-center  text-[17px] gap-15
          ${!isOnTop ? "text-black" : "text-white"}
        `}
        >
          {/*menu items*/}
          <a
            className="hover:text-amber-300 cursor-pointer transition"
            onClick={() => navigate("/")}
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
            <ul className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-md mt-2 min-w-[200px] py-2 z-50 border-1">
              {destinations.map((dest) => (
                <li
                  key={dest.id}
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer transition hover:text-amber-300"
                  onClick={() => navigate("/destinations")}
                >
                  <a className="block w-full">{dest.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <a
            className="hover:text-amber-300 cursor-pointer transition"
            onClick={() => navigate("/contact")}
          >
            Contact
          </a>
          <a className="hover:text-amber-300 cursor-pointer transition">
            About us
          </a>
        </div>
      </div>
    </div>
  );
}
