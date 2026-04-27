import { useTranslation } from "react-i18next";
import { Header } from "../../components/Header.jsx";
import { WhatsappContact } from "../../components/WhatsappContact.jsx";
import { DestinationsComp } from "./DestinationsComp.jsx";
import { Recommended } from "./Recommended.jsx";
import { Footer } from "../../components/Footer.jsx";
import { motion, AnimatePresence } from "framer-motion";

export function Homepage() {
  const { t } = useTranslation();

  // Animasyon varyantları
  const fadeInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };
  const capitalize = (str) =>
    str
      .split(" ")
      .map((word) =>
        word.length === 0
          ? word
          : word[0].toLocaleUpperCase("tr") +
            word.slice(1).toLocaleLowerCase("tr"),
      )
      .join(" ");

  return (
    <>
      <div className="relative bg-gradient-to-b from-gray-50 to-white overflow-x-hidden max-w-full">
        <title>{capitalize(t("hero.companyName"))}</title>
        <Header />

        <div className="relative">
          <video
            className="w-full  h-dvh block object-cover"
            autoPlay
            loop
            muted
            playsInline
            ref={(el) => {
              if (el) el.playbackRate = 0.85;
            }}
          >
            <source src="homepage-vid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>

          {/* Hero Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-5xl lg:text-5xl text-white mb-6 drop-shadow-2xl mt-14 font-onest font-bold leading-snug md:leading-tight">
                {t("hero.companyName")}
              </h1>

              <p className="text-gray-200 mt-2 text-xs md:text-sm tracking-wider uppercase font-onest">
                {t("hero.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-12 px-6 text-center shadow-inner">
          <motion.div
            className="p-8 order-2 md:order-1 md:mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInRight}
          >
            <div className="flex items-start justify-center gap-2 max-w-3xl mx-auto">
              <span className="text-5xl text-gray-800 leading-none mt-1">
                &#10077;
              </span>
              <p className="text-2xl md:text-4xl lg:text-5xl font-sans font-light tracking-tight text-gray-800 leading-relaxed">
                {t("hero.tagline")}
              </p>
              <span className="text-4xl md:text-5xl text-gray-800 leading-none self-end mb-1">
                &#10078;
              </span>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
          <DestinationsComp />
          <Recommended />
        </div>

        <WhatsappContact />
        <Footer />
      </div>
    </>
  );
}
