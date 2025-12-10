import { Header } from "../../components/Header.jsx";
import { WhatsappContact } from "../../components/WhatsappContact.jsx";
import { DestinationsComp } from "./DestinationsComp.jsx";
import { Recommended } from "./Recommended.jsx";

export function Homepage() {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="relative">
        <img
          className="w-full h-150 block object-cover"
          src="homepage-pic-1.jpg"
          alt="Turkey landscape"
        ></img>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 py-12 px-6 text-center shadow-inner">
        <p className="text-3xl md:text-4xl font-serif italic text-gray-700 max-w-3xl mx-auto">
          "Explore Turkey, Embrace the Journey."
        </p>
        <p className="text-gray-500 mt-2 text-sm tracking-wider uppercase">
          Your Gateway to Unforgettable Experiences
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        <DestinationsComp />
        <Recommended />
      </div>

      <WhatsappContact />
    </div>
  );
}
