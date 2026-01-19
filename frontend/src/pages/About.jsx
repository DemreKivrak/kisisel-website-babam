import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageEnd } from "../components/PageEnd";
import { WhatsappContact } from "../components/WhatsappContact";

export function About() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <title>About</title>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 pt-20">
            {t("about.heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            {t("about.heroSubtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <img
                  src="pp-image.jpeg"
                  alt="Yuksel Kivrak"
                  className="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-xl border-1 border-gray-100 "
                />
                <h3 className="text-2xl font-bold text-gray-800">
                  {t("about.guideName")}
                </h3>
                <p className="text-blue-700 font-semibold mt-2">
                  {t("about.licenseGuide")}
                </p>
                <p className="text-gray-600 mt-1">{t("about.experience")}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {t("about.welcomeTitle")}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {t("about.welcome1")}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t("about.welcome2")}
            </p>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-20">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                🏛️
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                {t("about.historicTitle")}
              </h3>
              <p className="text-gray-600">{t("about.historicDesc")}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                🚶
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                {t("about.localTitle")}
              </h3>
              <p className="text-gray-600">{t("about.localDesc")}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                ❤️
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                {t("about.passionTitle")}
              </h3>
              <p className="text-gray-600">{t("about.passionDesc")}</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            {t("about.experienceText")}
          </p>
        </div>

        {/* Gallipoli/ANZAC Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl">🕊️</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              {t("about.anzacTitle")}
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-200 leading-relaxed mb-6">
                {t("about.anzac1")}
              </p>
              <p className="text-lg text-gray-200 leading-relaxed italic border-l-4 border-blue-500 pl-6">
                "{t("about.anzac2")}"
              </p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            {t("about.offerTitle")}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                {t("about.architectureTitle")}
              </h3>
              <p className="text-gray-600">{t("about.architectureDesc")}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
              <div className="text-4xl mb-4">🏺</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                {t("about.ruinsTitle")}
              </h3>
              <p className="text-gray-600">{t("about.ruinsDesc")}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
              <div className="text-4xl mb-4">🏞️</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                {t("about.beautyTitle")}
              </h3>
              <p className="text-gray-600">{t("about.beautyDesc")}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-purple-500">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                {t("about.cultureTitle")}
              </h3>
              <p className="text-gray-600">{t("about.cultureDesc")}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                {t("about.battlefieldsTitle")}
              </h3>
              <p className="text-gray-600">{t("about.battlefieldsDesc")}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                {t("about.customTitle")}
              </h3>
              <p className="text-gray-600">{t("about.customDesc")}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto mb-6">
              {t("about.serviceDesc1")}
            </p>
            <p className="text-xl font-semibold text-gray-800">
              {t("about.serviceDesc2")}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("about.readyTitle")}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t("about.readyDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              {t("about.viewTours")}
            </Link>
            <Link
              to="/contact#contact"
              className="bg-gray-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg"
            >
              {t("about.contact")}
            </Link>
          </div>
        </div>
      </div>
      <WhatsappContact />
      <PageEnd />
    </>
  );
}
