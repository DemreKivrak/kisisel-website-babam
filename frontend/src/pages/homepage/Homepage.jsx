import { Header } from "../../components/Header.jsx";
import { WhatsappContact } from "../../components/WhatsappContact.jsx";
import { DestinationsComp } from "./DestinationsComp.jsx";
import { Recommended } from "./Recommended.jsx";
import { PageEnd } from "../../components/PageEnd.jsx";
import { PagePopup } from "../../components/PagePopup.jsx";

export function Homepage() {
  return (
    <>
      <div className="relative bg-gradient-to-b from-gray-50 to-white overflow-x-hidden max-w-full">
        <title>Anatolia Horizon Travel Agency</title>
        <Header />

        <div className="relative">
          <img
            className="w-full md:h-125 h-125 block object-cover"
            src="homepage-pic.jpg"
            alt="Turkey landscape"
          ></img>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>

          {/* Hero Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl text-white mb-6 drop-shadow-2xl mt-14 font-serif">
                ANATOLIA HORIZON TRAVEL
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 py-12 px-6 text-center shadow-inner">
          <p className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-gray-700 max-w-3xl mx-auto">
            "Explore Turkey,, Embrace the Journey."
          </p>
          <p className="text-gray-500 mt-2 text-xs md:text-sm tracking-wider uppercase">
            Your Gateway to Unforgettable Experiences
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
          <DestinationsComp />
          <Recommended />
        </div>

        <WhatsappContact />
        <PageEnd />
      </div>
    </>
  );
}
