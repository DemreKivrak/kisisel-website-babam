import { useMenu } from "../contexts/MenuContext";

export function WhatsappContact() {
  const { mobileMenuOpen } = useMenu();

  const handleWhatsApp = () => {
    const phone = "905362238340";
    const message = encodeURIComponent("");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    //old whatsapp component
    /*<div
        onClick={handleWhatsApp}
        className="h-16 fixed bottom-0 left-0 bg-[rgb(37,211,102)] flex items-center justify-center text-white cursor-pointer font-semibold z-20 w-full text-[18px] hidden md:flex"
      >
        WhatsApp: +90 536 223 83 40
      </div> */
  };

  if (mobileMenuOpen) {
    return null;
  }

  return (
    <>
      <img
        src="icons8-whatsapp-240.png"
        className="fixed bottom-5 right-5 cursor-pointer z-20 md:h-20 h-15 cursor-pointer"
        onClick={handleWhatsApp}
      ></img>
    </>
  );
}
