export function WhatsappContact() {
  const handleWhatsApp = () => {
    const phone = "905322315758";
    const message = encodeURIComponent("");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <>
      <div
        onClick={handleWhatsApp}
        className="h-16 fixed bottom-0 left-0 bg-[rgb(37,211,102)] flex items-center justify-center text-white cursor-pointer font-semibold z-20 w-full text-[18px]"
      >
        WhatsApp: +90 532 231 57 58
      </div>
    </>
  );
}
