import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { PageEnd } from "../components/PageEnd";
import { WhatsappContact } from "../components/WhatsappContact";

export function Destinations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Open destination from URL hash
  useEffect(() => {
    if (location.hash && destinations.length > 0) {
      const destId = parseInt(location.hash.substring(1));
      const destination = destinations.find((d) => d.id === destId);
      if (destination) {
        setSelectedDestination(destination);
        // Scroll to top after opening
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      }
    }
  }, [location.hash, destinations]);

  const loadData = async () => {
    try {
      const [destinationsData, toursData] = await Promise.all([
        api.getDestinations(),
        api.getTours(),
      ]);

      // Parse highlights from database
      const destinationsWithDefaults = destinationsData.map((dest) => ({
        ...dest,
        highlights: dest.highlights
          ? dest.highlights.split("\n").filter((h) => h.trim())
          : [],
      }));

      setDestinations(destinationsWithDefaults);
      setTours(toursData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const destinationsHardcoded = [
    {
      id: 1,
      name: "Istanbul",
      img: "homepage-pic-1.jpg",
      description:
        "Where East meets West - A city bridging two continents with rich history and vibrant culture",
      highlights: [
        "Hagia Sophia",
        "Blue Mosque",
        "Grand Bazaar",
        "Bosphorus Cruise",
      ],
    },
    {
      id: 2,
      name: "Cappadocia",
      img: "homepage-pic-1.jpg",
      description:
        "Fairy chimneys and hot air balloons - A surreal landscape of ancient cave dwellings",
      highlights: [
        "Hot Air Balloon Rides",
        "Underground Cities",
        "Göreme Open Air Museum",
        "Valley Hikes",
      ],
    },
    {
      id: 3,
      name: "Antalya",
      img: "homepage-pic-1.jpg",
      description:
        "Mediterranean paradise - Turquoise waters, ancient ruins, and sunny beaches",
      highlights: [
        "Kaleiçi Old Town",
        "Düden Waterfalls",
        "Ancient Side",
        "Beach Resorts",
      ],
    },
    {
      id: 4,
      name: "Bodrum",
      img: "homepage-pic-1.jpg",
      description:
        "Aegean coastal gem - Crystal clear waters and vibrant nightlife",
      highlights: [
        "Bodrum Castle",
        "Underwater Archaeology Museum",
        "Beach Clubs",
        "Greek Islands Day Trip",
      ],
    },
    {
      id: 5,
      name: "Pamukkale",
      img: "homepage-pic-1.jpg",
      description:
        "Cotton Castle - Stunning white travertine terraces and thermal pools",
      highlights: [
        "Travertine Terraces",
        "Ancient Hierapolis",
        "Thermal Pools",
        "Cleopatra's Pool",
      ],
    },
    {
      id: 6,
      name: "Trabzon",
      img: "homepage-pic-1.jpg",
      description:
        "Black Sea jewel - Lush green mountains, historic monasteries, and tea plantations",
      highlights: [
        "Sumela Monastery",
        "Uzungöl Lake",
        "Ayder Plateau",
        "Tea Gardens",
      ],
    },
  ];

  const filteredTours = selectedDestination
    ? tours.filter((tour) => tour.destination === selectedDestination.name)
    : [];

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading destinations...</p>
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
      <div className="relative bg-linear-to-r from-amber-100 via-orange-50 to-amber-100 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center mt-15">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Explore Destinations
          </h1>
          <p className="text-xl text-gray-600">
            Discover Turkey's most captivating locations and find your perfect
            tour
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Destinations Grid */}
        {!selectedDestination && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => setSelectedDestination(dest)}
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
        )}

        {/* Selected Destination Detail */}
        {selectedDestination && (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setSelectedDestination(null)}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Destinations
            </button>

            {/* Destination Hero */}
            <div className="relative h-96 rounded-xl overflow-hidden mb-8">
              <img
                src={selectedDestination.img}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-8">
                  <h1 className="text-5xl font-bold text-white mb-4">
                    {selectedDestination.name}
                  </h1>
                  <p className="text-xl text-white/90 max-w-2xl">
                    {selectedDestination.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Top Attractions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedDestination.highlights.map((highlight, idx) => (
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
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Available Tours in {selectedDestination.name}
                </h2>
                <div className="w-24 h-1 bg-linear-to-r from-amber-400 to-orange-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      <img
                        src={
                          tour.images
                            ? tour.images.split(",")[0].trim()
                            : "homepage-pic-1.jpg"
                        }
                        alt={tour.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-gray-500 uppercase mb-2">
                        {tour.duration}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 uppercase mb-4">
                        {tour.name}
                      </h3>
                      <button
                        className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white py-2 rounded-md hover:shadow-lg transition-all duration-300 font-semibold"
                        onClick={() => navigate(`/tourpage/${tour.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <WhatsappContact />
      <PageEnd />
    </div>
  );
}
