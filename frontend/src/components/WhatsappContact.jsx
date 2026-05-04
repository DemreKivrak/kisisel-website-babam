import { useMenu } from "../contexts/MenuContext";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsappContact() {
  const { mobileMenuOpen } = useMenu();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleWhatsApp = () => {
    const phone = "905362238340";
    const message = encodeURIComponent("");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const imgRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    // cleanup: component unmount olunca listener'ları kaldır
    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  //Mobile checker
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Animation
  const textAnimation = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (mobileMenuOpen) {
    return null;
  }

  return (
    <>
      <div className="flex  fixed bottom-5 right-5 items-center ">
        <AnimatePresence>
          {!isMobile && isVisible && (
            <motion.div
              variants={isMobile ? {} : textAnimation}
              initial={isMobile ? false : "hidden"}
              animate={isMobile ? {} : "visible"}
              exit={isMobile ? {} : "exit"}
            >
              <h1 className="bg-gradient-to-r from-[rgb(64,195,81)] to-[rgb(63,240,86)] text-white text-2xl px-5 rounded-3xl font-inter font-bold   py-2">
                {t("whatsapp.contactUs")}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <img
          ref={imgRef}
          src="/icons8-whatsapp-240.png"
          className=" cursor-pointer z-20 md:h-20 h-15 cursor-pointer "
          onClick={handleWhatsApp}
        ></img>
      </div>
    </>
  );
}
