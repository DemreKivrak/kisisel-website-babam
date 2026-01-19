import { useNavigate } from "react-router-dom";

export function PageEnd() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex-col">
        <div className="bg-[rgb(31,37,40)] min-h-90 flex flex-col md:flex-row justify-between px-4 md:px-8 py-8 md:py-0 overflow-x-hidden">
          <div className="mt-4 md:mt-10 mb-8 md:mb-0">
            <h1 className="text-white text-2xl md:text-3xl mt-4 md:mt-10 block mb-6">
              Contact Us
            </h1>

            {/* Phone Contact */}
            <div className="flex items-center gap-3 mb-4 ml-3 md:ml-0">
              <div className="bg-[rgb(42,48,51)] p-2 rounded-lg">
                <img
                  className="h-6 w-6"
                  src="icons8-phone-24.png"
                  alt="Phone"
                ></img>
              </div>
              <div className="ml-9 md:ml-12">
                <p className="text-gray-400 text-sm">Mobile & Whatsapp</p>
                <a
                  href="tel:+905362238340"
                  className="text-white text-base md:text-lg font-semibold hover:text-green-400 transition"
                >
                  +90 536 223 83 40
                </a>
              </div>
            </div>

            {/* Email Contact */}
            <div className="flex items-center gap-3 ml-3 md:ml-0">
              <div className="bg-[rgb(42,48,51)] p-2 rounded-lg">
                <img
                  className="h-6 w-6"
                  src="icons8-email-50.png"
                  alt="Email"
                ></img>
              </div>
              <div className="ml-3 md:ml-5">
                <p className="text-gray-400 text-sm">
                  Send us an email anytime!
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
          <div className="text-white mb-6 md:mt-20 md:ml-20">
            <p
              className="hover:text-green-300 cursor-pointer mb-2"
              onClick={() => navigate("/tours")}
            >
              TOURS
            </p>
            <p
              className="hover:text-green-300 cursor-pointer mb-2"
              onClick={() => navigate("/destinations")}
            >
              DESTINATIONS
            </p>
            <p
              className="hover:text-green-300 cursor-pointer mb-2"
              onClick={() => navigate("/services")}
            >
              RENTAL SERVICES
            </p>
          </div>
          <div className="text-white mb-6 md:mt-20">
            <p
              className="hover:text-green-300 cursor-pointer mb-2"
              onClick={() => navigate("/")}
            >
              HOME
            </p>
            <p
              className="hover:text-green-300 cursor-pointer mb-2"
              onClick={() => navigate("/about")}
            >
              ABOUT US
            </p>
            <p
              className="hover:text-green-300 cursor-pointer mb-2"
              onClick={() => navigate("/galery")}
            >
              GALLERY
            </p>
            <p
              className="hover:text-green-300 cursor-pointer mb-2"
              onClick={() => navigate("/contact")}
            >
              CONTACT US
            </p>
          </div>
          <div className="flex justify-center md:block">
            <div>
              <img
                className="h-40 md:h-45 md:mt-14"
                src="oltre-white.png"
                alt="Logo"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
