import { Header } from "../../components/Header.jsx";
import { WhatsappContact } from "../../components/WhatsappContact.jsx";
import { DestinationsComp } from "./DestinationsComp.jsx";
import { Recommended } from "./Recommended.jsx";

export function Homepage() {
  return (
    <div className="relative">
      <Header />

      <img
        className="w-full h-150 block bg-[rgb(240, 240, 240)]"
        src="homepage-pic-1.jpg"
      ></img>

      <div className="bg-[rgb(240, 240, 240)] h-20 flex justify-center mt-5">
        <p className="text-2xl">"Explore Turkey, Embrace the Journey."</p>
      </div>
      <div className="flex">
        <DestinationsComp />
        <Recommended />
      </div>
    </div>
  );
}
