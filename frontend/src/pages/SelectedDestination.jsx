import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { Footer } from "../components/Footer";
import { WhatsappContact } from "../components/WhatsappContact";

export function SelectedDestination() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [destinationsData, toursData] = await Promise.all([
          api.getDestinations(),
          api.getTours(),
        ]);

        const dest = destinationsData.find((d) => d.id === parseInt(id));
        if (dest) {
          setDestination({
            ...dest,
            highlights: dest.highlights
              ? dest.highlights.split("\n").filter((h) => h.trim())
              : [],
          });
        }
        setTours(toursData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const filteredTours = destination
    ? tours.filter((tour) => tour.destination === destination.name)
    : [];

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

  if (!destination) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600 text-lg">Destination not found.</p>
        </div>
      </>
    );
  }

  return (
    <div className="bb min-h-screen">
      <title>{destination.name}</title>
      <Header />

      {/* Destination Hero — full width */}
      <div className="relative  h-[65vh] md:h-[75vh] w-full  overflow-hidden">
        <img
          src={destination.img}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 w-full pb-10">
            <h1 className=" text-4xl md:text-5xl font-onest font-bold text-white mb-4 justify-self-start">
              {destination.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 hidden md:flex items-center gap-2 text-sm text-gray-500">
          <span
            className="hover:text-blue-500 cursor-pointer transition"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span>/</span>
          <span
            className="hover:text-blue-500 cursor-pointer transition"
            onClick={() => navigate("/destinations")}
          >
            Destinations
          </span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{destination.name}</span>
        </nav>

        {/* Highlights */}
        <div className="mb-12 justify-items-start">
          <h2 className="  text-xl md:text-3xl font-bold text-gray-800 mb-6 font-onest">
            {t("destinations.topAttractions")} in {destination.name}
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 font-onest">
            {destination.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-md text-center"
              >
                <p className="font-semibold text-gray-800">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Available Tours */}
        <div>
          <div className="mb-8 justify-items-start">
            <h2 className=" text-xl md:text-3xl font-bold font-onest text-gray-800 mb-2">
              {t("destinations.availableTours")} {destination.name}
            </h2>
            -
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col w-full max-w-[280px]"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={
                      tour.images
                        ? tour.images.split(",")[0].trim()
                        : "homepage-pic-1.jpg"
                    }
                    alt={tour.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
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
                      {tour.duration}
                    </div>
                  </div>

                  {/* Tour Name */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                    {tour.name}
                  </h3>

                  {/* Features */}
                  <div className="space-y-1 mb-2">
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
                    className="mt-auto w-4/7 bg-gradient-to-r from-[rgb(36,54,61)] to-[rgb(49,76,88)] text-white py-2 rounded-3xl font-medium transition-all duration-400 flex items-center justify-center gap-2 shadow-md group-hover:shadow-lg cursor-pointer mx-auto hover:bg-white hover:bg-none hover:text-[rgb(31,37,40)] hover:border-1"
                  >
                    <span>{t("tours.viewDetails")}</span>
                  </button>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <WhatsappContact />
      <Footer />
    </div>
  );
}
