import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { PageEnd } from "../components/PageEnd";
import { WhatsappContact } from "../components/WhatsappContact";

export function About() {
  return (
    <>
      <Header />
      <title>About</title>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 pt-20">
            Discover Turkey with a Passion
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            Your Expert Tour Guide, Yuksel Kivrak
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
                  Yuksel Kivrak
                </h3>
                <p className="text-blue-700 font-semibold mt-2">
                  Licensed Tour Guide
                </p>
                <p className="text-gray-600 mt-1">30+ Years Experience</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Welcome to My World
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The most picturesque and pleasant way to discover Istanbul and
              Turkey is with your expert tour guide, Yuksel Kivrak. Over 30
              years ago I arrived in Istanbul, basing myself in Old Ottoman and
              the Byzantine Capital.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With a passion to show others my magnificent, historic city - and
              its surrounding areas - I obtained a Tourist Guide License,
              allowing me the pleasure to present to you one of the most
              beautiful countries in the world, Turkey, and its fascinating
              cities such as Istanbul, the capital of tourism in Turkey.
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
                Historic Expertise
              </h3>
              <p className="text-gray-600">
                Deep knowledge of Ottoman and Byzantine history
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                🚶
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                Local Knowledge
              </h3>
              <p className="text-gray-600">
                Walked and cycled every corner of Istanbul
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                ❤️
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                Unwavering Passion
              </h3>
              <p className="text-gray-600">
                30+ years of enthusiasm for this impressive metropolis
              </p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            I have walked and cycled every corner of this wonderful city,
            witnessed the many changes throughout the years, and have never lost
            my enthusiasm for this impressive metropolis or my desire for others
            to see it as I do, in all its greatness.
          </p>
        </div>

        {/* Gallipoli/ANZAC Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl">🕊️</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              The ANZAC Spirit
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-200 leading-relaxed mb-6">
                Living in Çanakkale for 4 years, I have witnessed firsthand the
                Australian spirit and respect for the fallen ones of ANZAC and
                the tragic events that occurred at the Gallipoli Peninsula.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed italic border-l-4 border-blue-500 pl-6">
                "Countless times I have solemnly looked out over that
                battlefield with my head bowed in respect for our lost loved
                ones. Such memories and visions are instilled in my heart
                forever, and they will be in yours as well, I am sure."
              </p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            What I Offer
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                Architecture & History
              </h3>
              <p className="text-gray-600">
                Explore magnificent Ottoman palaces, Byzantine churches, and
                ancient architectural wonders
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
              <div className="text-4xl mb-4">🏺</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                Ancient Ruins
              </h3>
              <p className="text-gray-600">
                Discover the remnants of ancient civilizations and walk through
                millennia of history
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
              <div className="text-4xl mb-4">🏞️</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                Natural Beauty
              </h3>
              <p className="text-gray-600">
                Experience breathtaking landscapes, from coastal paradises to
                fairy chimneys
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-purple-500">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                Local Culture
              </h3>
              <p className="text-gray-600">
                Immerse yourself in authentic Turkish culture, traditions, and
                daily life
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                ANZAC Battlefields
              </h3>
              <p className="text-gray-600">
                Solemn and respectful tours of Gallipoli Peninsula's historic
                battlefields
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                Custom Tours
              </h3>
              <p className="text-gray-600">
                Personalized itineraries tailored to your interests and schedule
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto mb-6">
              I have personally travelled with numerous Tour Groups throughout
              this stunning land. Are you interested in architecture, history,
              ancient ruins, natural beauty, local culture or the ANZAC
              battlefields? Your time is precious, so tell me what you would
              like to see and I will make it happen for you.
            </p>
            <p className="text-xl font-semibold text-gray-800">
              Nothing is too much trouble, because I want you to discover the
              heartbeat and spirit of Turkey in the best possible way: with me
              as your passionate, knowledgeable tour guide.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore Turkey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's create unforgettable memories together. Browse our tours or
            get in touch to plan your perfect Turkish adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              View Tours
            </Link>
            <Link
              to="/contact#contact"
              className="bg-gray-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
      <WhatsappContact />
      <PageEnd />
    </>
  );
}
