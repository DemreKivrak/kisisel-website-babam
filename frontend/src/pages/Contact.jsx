import { Header } from "../components/Header";

export function Contact() {
  return (
    <div className="bg-white min-h-screen">
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
            <h1 className="text-6xl font-bold text-white mb-4">CONTACT US</h1>
            <p className="text-xl text-white/90">
              We're here to help plan your perfect Turkish adventure
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Quick Contact Cards */}
        <div className="flex justify-evenly gap-6 mb-16">
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
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                MOBILE & WHATSAPP
              </h3>
              <a
                href="tel:+905322315758"
                className="text-2xl font-semibold text-green-400 hover:text-green-700 transition"
              >
                +90 532 231 57 58
              </a>
              <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
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
              <h3 className="text-lg font-bold text-gray-800 mb-2">EMAIL</h3>
              <a
                href="mailto:ornekemail@gmail.com"
                className="text-xl font-semibold text-green-400 hover:text-green-700 transition break-all"
              >
                ornekemail@gmail.com
              </a>
              <p className="text-sm text-gray-500 mt-2">Response within 24h</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-12 max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <span className="text-amber-500 text-3xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  Expert Local Guides
                </h4>
                <p className="text-gray-600">
                  Professional English-speaking guides with deep local knowledge
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-amber-500 text-3xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  Best Price Guarantee
                </h4>
                <p className="text-gray-600">
                  Competitive prices with no hidden fees
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-amber-500 text-3xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  24/7 Support
                </h4>
                <p className="text-gray-600">
                  Always available to help during your journey
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-amber-500 text-3xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  Quality Service
                </h4>
                <p className="text-gray-600">
                  Dedicated to making your journey unforgettable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
