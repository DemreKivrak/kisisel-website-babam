import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex-col">
        <div className=" bg-gradient-to-l from-[rgb(31,37,40)] to-[rgb(12,22,27)] min-h-80 flex flex-col md:flex-row justify-between px-4 md:px-8 py-8 md:py-0 overflow-x-hidden">
          <div className="mt-4 md:mt-10 mb-8 md:mb-0">
            <h1 className="text-white text-2xl md:text-3xl mt-4 md:mt-8 block mb-6 md:ml-12 font-onest font-semibold">
              {t("footer.contactUs")}
            </h1>

            {/* Phone Contact */}
            <div className="flex items-center gap-3 mb-4 ml-3 md:ml-0 font-onest ">
              <div className="bg-[rgb(42,48,51)] p-2 rounded-lg">
                <img
                  className="h-6 w-6"
                  src="/icons8-phone-24.png"
                  alt="Phone"
                ></img>
              </div>
              <div className="ml-9 md:ml-6">
                <p className="text-gray-400 text-sm">{t("contact.phone")}</p>
                <a
                  href="tel:+905362238340"
                  className="text-white text-base md:text-lg font-semibold hover:text-green-400 transition"
                >
                  +90 536 223 83 40
                </a>
              </div>
            </div>

            {/* Email Contact */}
            <div className="flex items-center gap-3  ml-3 md:ml-0 ">
              <div className="bg-[rgb(42,48,51)] p-2 rounded-lg">
                <img
                  className="h-6 w-6"
                  src="/icons8-email-50.png"
                  alt="Email"
                ></img>
              </div>
              <div className="ml-3 md:ml-5">
                <p className="text-gray-400 text-sm">
                  {t("contact.sendEmail")}
                </p>
                <a
                  href="mailto:info@gurtour.com"
                  className="text-white text-base md:text-lg font-semibold hover:text-green-400 transition break-all"
                >
                  oltretour@hotmail.com
                </a>
              </div>
            </div>
          </div>

          {/*quick links */}
          <div className=" md:grid md:grid-cols-2 ">
            <div className="text-white mb-6 md:mt-20 md:ml-0 md:mr-15">
              <p
                className="hover:text-green-300 cursor-pointer mb-2"
                onClick={() => navigate("/tours")}
              >
                {t("nav.tours").toUpperCase()}
              </p>
              <p
                className="hover:text-green-300 cursor-pointer mb-2"
                onClick={() => navigate("/destinations")}
              >
                {t("nav.destinations").toUpperCase()}
              </p>
              <p
                className="hover:text-green-300 cursor-pointer mb-2"
                onClick={() => navigate("/car-rental")}
              >
                {t("nav.services").toUpperCase()}
              </p>
            </div>
            <div className="text-white mb-6 md:mt-20 md:mr-15">
              <p
                className="hover:text-green-300 cursor-pointer mb-2"
                onClick={() => navigate("/")}
              >
                {t("nav.home").toUpperCase()}
              </p>
              <p
                className="hover:text-green-300 cursor-pointer mb-2"
                onClick={() => navigate("/about")}
              >
                {t("nav.about").toUpperCase()}
              </p>
              <p
                className="hover:text-green-300 cursor-pointer mb-2"
                onClick={() => navigate("/galery")}
              >
                {t("nav.gallery").toUpperCase()}
              </p>
              <p
                className="hover:text-green-300 cursor-pointer mb-2"
                onClick={() => navigate("/contact")}
              >
                {t("nav.contact").toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex justify-center md:block">
            <div>
              <img
                className="h-40 md:h-45 md:mt-14"
                src="/oltre-white.png"
                alt="Logo"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
