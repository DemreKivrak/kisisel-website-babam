import { Header } from "../../components/Header.jsx";
import { WhatsappContact } from "../../components/WhatsappContact.jsx";

export function Homepage() {
  return (
    <div className="relative">
      <Header />
      <img className="w-full" src="homepage-pic-1.jpg"></img>
      <WhatsappContact />
    </div>
  );
}
