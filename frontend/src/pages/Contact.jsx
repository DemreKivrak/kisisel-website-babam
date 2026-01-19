import { Header } from "../components/Header";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageEnd } from "../components/PageEnd";
import { WhatsappContact } from "../components/WhatsappContact";

export function Contact() {
  const { t } = useTranslation();
  const location = useLocation();
  const yandexLink =
    "https://yandex.com.tr/maps/org/oltre_turizm/1254953363/?ll=28.986200%2C41.043300&z=14";

  useEffect(() => {
    const scrollToElement = (elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        const yOffset = -100; // Bu değeri değiştirerek scroll konumunu ayarlayın
        const y =
          element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    // Check if there's a scrollTo in location state
    if (location.state?.scrollTo) {
      setTimeout(() => scrollToElement(location.state.scrollTo), 300);
    } else {
      // Handle hash from URL (for HashRouter: #/contact#section)
      const url = window.location.href;
      const hashIndex = url.lastIndexOf("#");
      if (hashIndex > 0 && url.indexOf("#") !== hashIndex) {
        const sectionId = url.substring(hashIndex + 1);
        setTimeout(() => scrollToElement(sectionId), 300);
      }
    }
  }, [location]);

  return (
    <div className="bg-white min-h-screen">
      <title>Contact us</title>
      <Header />

      {/* Hero Section */}
      <div className="relative">
        <img
          className="w-full h-96 block object-cover"
          src="homepage-pic-1.jpg"
          alt="Turkey landscape"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/30 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">
              {t("contact.title").toUpperCase()}
            </h1>
            <p className="text-xl text-white/90">{t("contact.heroSubtitle")}</p>
          </div>
        </div>
      </div>

      <div id="contact" className="max-w-7xl mx-auto px-4 py-16">
        {/* Quick Contact Cards */}
        <div className="md:flex justify-evenly md:gap-6 mb-16 flex flex-col md:flex-row gap-6">
          {/* Phone Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-1 border-dotted">
            <div className="flex flex-col items-center text-center">
              <div className="bg-linear-to-br p-4 rounded-full mb-4 border-1 border-dotted border-black">
                <img
                  className="h-12 w-12"
                  src="icons8-call-50.png"
                  alt="Phone"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 md:mt-10">
                {t("contact.phone").toUpperCase()}
              </h3>
              <a
                href="tel:+905322315758"
                className="text-2xl font-semibold text-green-400 hover:text-green-700 transition"
              >
                +90 536 223 83 40
              </a>
              <p className="text-sm text-gray-500 mt-2">
                {t("contact.available")}
              </p>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-1 border-dotted">
            <div className="flex flex-col items-center text-center">
              <div className="bg-linear-to-br p-4 rounded-full mb-4 border-1 border-dotted">
                <img
                  className="h-12 w-12"
                  src="icons8-email-64.png"
                  alt="Email"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 md:mt-10">
                {t("contact.email").toUpperCase()}
              </h3>
              <a
                href="mailto:ornekemail@gmail.com"
                className="text-xl font-semibold text-green-400 hover:text-green-700 transition break-all"
              >
                oltretour@hotmail.com
              </a>
              <p className="text-sm text-gray-500 mt-2">
                {t("contact.response")}
              </p>
            </div>
          </div>

          {/*location card */}

          <div
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all
           duration-300 transform hover:-translate-y-2 border-1 border-dotted md:w-65"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-linear-to-br p-4 rounded-full mb-4 border-1 border-dotted">
                <img
                  className="h-12 w-12"
                  src="icons8-location-100.png"
                  alt="location"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t("contact.location").toUpperCase()}
              </h3>
              <p className="">
                Bozkurt Mah.Ergenekon Cad.Muratoğlu Çarşısı No:41 Kat:3
                Daire:116 Pangaltı-Şişli/Istanbul
              </p>
              <button
                className="
                bg-green-400 mt-5 rounded-xl font-semibold px-2 py-1 text-white cursor-pointer group-hover:shadow hover:bg-green-600 transition duration-300 
              "
                onClick={() =>
                  window.open(yandexLink, "_blank", "noopener,noreferrer")
                }
              >
                {t("contact.viewOnMap")}
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-12 max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            {t("contact.whyChoose")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <span className="text-amber-500 text-3xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {t("contact.expertGuides")}
                </h4>
                <p className="text-gray-600">{t("contact.expertGuidesDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-amber-500 text-3xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {t("contact.bestPrice")}
                </h4>
                <p className="text-gray-600">{t("contact.bestPriceDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-amber-500 text-3xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {t("contact.support")}
                </h4>
                <p className="text-gray-600">{t("contact.supportDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-amber-500 text-3xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {t("contact.quality")}
                </h4>
                <p className="text-gray-600">{t("contact.qualityDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WhatsappContact />
      <PageEnd />
    </div>
  );
}
