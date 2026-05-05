import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Footer } from "../components/Footer";
import { WhatsappContact } from "../components/WhatsappContact";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  return (
    <>
      <Header />
      <title>{t("about.title")} - Oltre Tours</title>

      {/* Hero Section */}
      <div className="relative">
        <img
          className="w-full md:h-161 h-125  block object-cover"
          src="istanbul-photo.jpg"
          alt="Turkey landscape"
        ></img>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <p className="text-sm md:text-2xl font-medium tracking-wider uppercase mb-4 opacity-90 text-white">
              {t("about.since2000")}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              {t("about.heroTitle")}
            </h1>
          </div>
        </div>
      </div>

      {/*
          <div className="relative bg-blue-600 text-white py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm font-medium tracking-wider uppercase mb-4 opacity-90">
            2000'den Beri
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Turizmde Çeyrek Asırlık Güven
          </h1>
          <div className="w-20 h-1 bg-white mx-auto opacity-50"></div>
        </div>
      </div>
 */}

      {/* Breadcrumb */}
      <nav className=" ml-5 mt-10  hidden md:flex items-center gap-2 text-sm text-gray-500 mt-5">
        <span
          className="hover:text-blue-500 cursor-pointer transition"
          onClick={() => navigate("/")}
        >
          {t("nav.home")}
        </span>
        <span>/</span>

        <span className="text-gray-800 font-medium">{t("about.title")}</span>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 ">
        {/* Introduction Section */}
        <div className="mb-24 md:mt-42 md:mb-42">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-onest text-gray-900 mb-8">
              Oltre Tours
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-onest">
              {t("about.introText")}
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-24 font-onest">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("about.whyChooseTitle")}
            </h2>
            <p className="text-gray-600">{t("about.whyChooseSubtitle")}</p>
          </div>

          <div className="space-y-32">
            {/* Service 1 */}
            <div className="grid md:grid-cols-2 gap-8 items-center font-onest">
              <motion.div
                className="h-80 flex items-center justify-center font-onest"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeInLeft}
              >
                {/* Placeholder for image */}
                <img className="rounded-2xl" src="fleet.jpg"></img>
              </motion.div>
              <motion.div
                className="p-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeInRight}
              >
                <h3 className="font-semibold text-2xl text-gray-900 mb-4">
                  {t("about.fleetTitle")}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t("about.fleetDesc")}
                </p>
              </motion.div>
            </div>

            {/* Service 2 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="p-8 order-2 md:order-1 md:mb-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeInLeft}
              >
                <h3 className="font-semibold text-2xl text-gray-900 mb-4">
                  {t("about.corporateTitle")}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t("about.corporateDesc")}
                </p>
              </motion.div>
              <motion.div
                className="h-80 flex items-center justify-center order-1 md:order-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeInRight}
              >
                <img className="rounded-2xl" src="corparete.png"></img>
              </motion.div>
            </div>

            {/* Service 3 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="h-80 flex items-center justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeInLeft}
              >
                <img className="rounded-2xl" src="domestic.png"></img>
              </motion.div>
              <motion.div
                className="p-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeInRight}
              >
                <h3 className="font-semibold text-2xl text-gray-900 mb-4">
                  {t("about.touristTitle")}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t("about.touristDesc")}
                </p>
              </motion.div>
            </div>

            {/* Service 4 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="p-8 order-2 md:order-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeInLeft}
              >
                <h3 className="font-semibold text-2xl text-gray-900 mb-4">
                  {t("about.expertTitle")}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t("about.expertDesc")}
                </p>
              </motion.div>
              <motion.div
                className="h-80 flex items-center justify-center order-1 md:order-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeInRight}
              >
                <img className="rounded-2xl" src="staff.png"></img>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mb-24">
          <div className="bg-gray-50 p-12 md:p-16 border-l-4 border-blue-900">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold font-onest text-gray-900 mb-6">
                {t("about.visionTitle")}
              </h2>
              <p className="text-lg text-gray-700 font-onest leading-relaxed">
                {t("about.visionText")}
              </p>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="mb-24">
          <div className="max-w-3xl mx-auto text-center py-12">
            <p className="text-2xl md:text-3xl font-light text-gray-800 mb-6 leading-relaxed">
              {t("about.motto")}
            </p>
            <p className="text-xl text-blue-600 font-medium">
              {t("about.tagline")}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-900 text-white p-12 md:p-16 text-center rounded-3xl mb-15">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("about.ctaTitle")}
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto text-gray-300">
            {t("about.ctaDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white/0 border-white px-8 py-4 font-semibold text-white border-1  rounded-4xl hover:bg-white transition duration-300 hover:text-gray-900"
            >
              {t("about.getInTouch")}
            </Link>
          </div>
        </div>
      </div>
      <WhatsappContact />
      <Footer />
    </>
  );
}
