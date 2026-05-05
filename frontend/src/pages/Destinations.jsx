import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { Footer } from "../components/Footer";
import { WhatsappContact } from "../components/WhatsappContact";

export function Destinations() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const destinationsData = await api.getDestinations();

      const destinationsWithDefaults = destinationsData.map((dest) => ({
        ...dest,
        highlights: dest.highlights
          ? dest.highlights.split("\n").filter((h) => h.trim())
          : [],
      }));

      setDestinations(destinationsWithDefaults);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              {t("destinations.loadingText")}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <title>Destinations</title>
      <Header />

      {/* Hero Section */}
      <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
        <img
          src="/dest-img.jpg"
          alt="Tours"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 w-full pb-10">
            <h1 className="text-2xl md:text-6xl font-onest font-semibold text-white mb-3 justify-self-start">
              {t("destinations.exploreTitle")}
            </h1>
            <p className="text-sm md:text-xl text-white/80 font-onest text-left">
              {t("destinations.subtitle")}
            </p>
          </div>
        </div>
      </div>
      {/* Breadcrumb */}
      <nav className=" ml-5 mb-8 hidden md:flex items-center gap-2 text-sm text-gray-500 mt-5">
        <span
          className="hover:text-blue-500 cursor-pointer transition"
          onClick={() => navigate("/")}
        >
          {t("nav.home")}
        </span>
        <span>/</span>
        <span className="text-gray-800 font-medium">
          {t("nav.destinations")}
        </span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigate(`/destinations/${dest.id}`)}
              className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {dest.name}
                  </h2>
                  <p className="text-white/90 text-sm">{dest.description}</p>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex flex-wrap gap-2">
                  {dest.highlights.slice(0, 3).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <WhatsappContact />
      <Footer />
    </div>
  );
}
