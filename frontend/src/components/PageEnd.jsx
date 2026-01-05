import { useNavigate } from "react-router-dom";

export function PageEnd() {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-[rgb(31,37,40)] h-90 flex justify-between">
        <div className="mt-10">
          <h1 className="text-white text-3xl mt-10 block ml-15 mb-6  ">
            Contact Us
          </h1>

          {/* Phone Contact */}
          <div className=" ml-15 flex items-center gap-3 mb-4">
            <div className="bg-[rgb(42,48,51)] p-2 rounded-lg">
              <img
                className="h-6 w-6"
                src="icons8-phone-24.png"
                alt="Phone"
              ></img>
            </div>
            <div className="ml-5">
              <p className="text-gray-400 text-sm">Mobile & Whatsapp</p>
              <a
                href="tel:+908508887609"
                className="text-white text-lg font-semibold hover:text-green-400 transition"
              >
                +90 532 231 57 58
              </a>
            </div>
          </div>

          {/* Email Contact */}
          <div className=" ml-15 flex items-center gap-3">
            <div className="bg-[rgb(42,48,51)] p-2 rounded-lg">
              <img
                className="h-6 w-6"
                src="icons8-email-50.png"
                alt="Email"
              ></img>
            </div>
            <div className="ml-5">
              <p className="text-gray-400 text-sm mr-10">
                Send us an email anytime!
              </p>
              <a
                href="mailto:info@gurtour.com"
                className="text-white text-lg font-semibold hover:text-green-400 transition"
              >
                yukselkivrak@hotmail.com
              </a>
            </div>
          </div>
        </div>

        {/*quick links */}
        <div className="text-white mt-20 ml-20">
          <p
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/tours")}
          >
            TOURS
          </p>
          <p
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/destinations")}
          >
            DESTINATIONS
          </p>
          <p
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/services")}
          >
            RENTAL SERVICES
          </p>
        </div>
        <div className="text-white mt-20 ">
          <p
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/")}
          >
            HOME
          </p>
          <p
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/about")}
          >
            ABOUT US
          </p>
          <p
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/galery")}
          >
            GALLERY
          </p>
          <p
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/contact")}
          >
            CONTACT US
          </p>
        </div>
        <div className="">
          <div>
            <img className="h-70" src="logo-white.png"></img>
          </div>
        </div>
      </div>
    </>
  );
}
