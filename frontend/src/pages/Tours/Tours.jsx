import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { TourPage } from "../../components/TourPage";
import { api } from "../../services/api";

export function Tours() {
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [toursData, destinationsData] = await Promise.all([
        api.getTours(),
        api.getDestinations(),
      ]);

      // Add default properties for tours
      const toursWithDefaults = toursData.map((tour) => ({
        ...tour,
        img: tour.img || "homepage-pic-1.jpg",
        type: "Guaranteed Departured Tour",
      }));

      setTours(toursWithDefaults);

      // Build destinations list from unique tour destinations
      const uniqueDestinations = [
        "All",
        ...new Set(toursData.map((t) => t.destination)),
      ];
      setDestinations(uniqueDestinations);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toursHardcoded = [
    {
      id: 1,
      name: "MEDITERRANEAN GLAMOUR",
      destination: "Antalya",
      duration: "04 Nights / 05 Days",
      price: "775 €",
      img: "homepage-pic-1.jpg",
      type: "Guaranteed Departured Tour with Flights",
    },
    {
      id: 2,
      name: "CAPPADOCIA DAYDREAM",
      destination: "Cappadocia",
      duration: "01 Night / 02 Days",
      price: "365 €",
      img: "homepage-pic-1.jpg",
      type: "Guaranteed Departured Tours",
    },
    {
      id: 3,
      name: "ISTANBUL HIGHLIGHTS",
      destination: "Istanbul",
      duration: "03 Nights / 04 Days",
      price: "520 €",
      img: "homepage-pic-1.jpg",
      type: "Guaranteed Departured Tour with Flights",
    },
    {
      id: 4,
      name: "AEGEAN PARADISE",
      destination: "Bodrum",
      duration: "05 Nights / 06 Days",
      price: "890 €",
      img: "homepage-pic-1.jpg",
      type: "Guaranteed Departured Tour with Flights",
    },
    {
      id: 5,
      name: "BLACK SEA ADVENTURE",
      destination: "Trabzon",
      duration: "04 Nights / 05 Days",
      price: "650 €",
      img: "homepage-pic-1.jpg",
      type: "Guaranteed Departured Tours",
    },
    {
      id: 6,
      name: "PAMUKKALE THERMAL",
      destination: "Pamukkale",
      duration: "02 Nights / 03 Days",
      price: "425 €",
      img: "homepage-pic-1.jpg",
      type: "Guaranteed Departured Tours",
    },
  ];

  const filteredTours =
    selectedDestination === "All"
      ? tours
      : tours.filter((tour) => tour.destination === selectedDestination);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading tours...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 mt-5">
            Discover Our Tours
          </h1>
          <p className="text-xl text-gray-600">
            Explore Turkey's most beautiful destinations with our curated tour
            packages
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
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

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-md shadow-lg z-10">
                  <p className="text-xs text-gray-600">Starting From</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {tour.price}
                  </p>
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
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all duration-300 text-sm font-semibold"
                    onClick={() => navigate(`/tourpage/${tour.id}`)}
                  >
                    View Details
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
    </div>
  );
}
