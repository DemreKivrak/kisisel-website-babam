import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { Footer } from "../components/Footer";
import { WhatsappContact } from "../components/WhatsappContact";
import { useNavigate } from "react-router-dom";

export function Galery() {
  const { t } = useTranslation();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load gallery items from API
  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await api.getGallery();
      setItems(data);
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  const handleMediaClick = (item) => {
    setSelectedMedia(item);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  // Close lightbox with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedMedia) {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedMedia]);

  // Body overflow control
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedMedia]);

  return (
    <>
      <Header />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl text-slate-600">{t("gallery.loading")}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-200">
            {/* Header */}
            <div className="text-center mb-12 pt-8 mt-25">
              <h1 className="text-5xl font-bold text-slate-800 mb-4">
                {t("gallery.title")}
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                {t("gallery.subtitle")}
              </p>
            </div>

            {/* Breadcrumb */}
            <nav className=" ml-5 mt-10  hidden md:flex items-center gap-2 text-sm text-gray-500 mt-5">
              <span
                className="hover:text-blue-500 cursor-pointer transition"
                onClick={() => navigate("/")}
              >
                {t("nav.home")}
              </span>
              <span>/</span>

              <span className="text-gray-800 font-medium">
                {t("gallery.title")}
              </span>
            </nav>

            {/* Filters */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              <button
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50"
                }`}
                onClick={() => setFilter("all")}
              >
                {t("gallery.all")} ({items.length})
              </button>
              <button
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl ${
                  filter === "image"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50"
                }`}
                onClick={() => setFilter("image")}
              >
                {t("gallery.photos")} (
                {items.filter((item) => item.type === "image").length})
              </button>
              <button
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl ${
                  filter === "video"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50"
                }`}
                onClick={() => setFilter("video")}
              >
                {t("gallery.videos")} (
                {items.filter((item) => item.type === "video").length})
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl group"
                  onClick={() => handleMediaClick(item)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/60 rounded-full w-20 h-20 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500/90 group-hover:scale-110">
                          <svg
                            viewBox="0 0 24 24"
                            width="40"
                            height="40"
                            fill="white"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredItems.length === 0 && (
              <div className="text-center py-16 text-slate-500 text-xl">
                <p>{t("gallery.noContent")}</p>
              </div>
            )}

            {/* Lightbox */}
            {selectedMedia && (
              <div
                className="fixed inset-0 bg-black/95 flex items-center justify-center z-[10000] p-8 animate-fadeIn cursor-pointer"
                onClick={(e) => {
                  // Close only if clicking on background
                  if (e.target === e.currentTarget) {
                    closeLightbox();
                  }
                }}
              >
                <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                  <button
                    className="sticky top-4 right-4 float-right text-white text-4xl w-14 h-14 flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:text-red-400 bg-black/70 rounded-full hover:bg-red-500/90 z-50 shadow-2xl mb-4"
                    onClick={closeLightbox}
                  >
                    ✕
                  </button>

                  {selectedMedia.type === "image" ? (
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      className="w-full h-auto max-h-[65vh] object-contain rounded-xl"
                    />
                  ) : (
                    <div className="relative w-full max-h-[65vh] aspect-video overflow-hidden rounded-xl">
                      <iframe
                        src={selectedMedia.url}
                        title={selectedMedia.title}
                        className="absolute top-0 left-0 w-full h-full rounded-xl"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  <div className="bg-white p-6 mt-4 rounded-xl">
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">
                      {selectedMedia.title}
                    </h2>
                    <p className="text-slate-600 text-base leading-relaxed max-h-32 overflow-y-auto">
                      {selectedMedia.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideUp {
              from {
                transform: translateY(50px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease;
            }
            .animate-slideUp {
              animation: slideUp 0.4s ease;
            }
          `}</style>
        </>
      )}
      <WhatsappContact />
      <Footer />
    </>
  );
}
