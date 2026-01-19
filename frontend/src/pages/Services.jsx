import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { PageEnd } from "../components/PageEnd";
import { WhatsappContact } from "../components/WhatsappContact";

export function Services() {
  const { t } = useTranslation();
  const [carCategories, setCarCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Services - Car Rental";
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const data = await api.getRentalCars();
      // Transform data to match component structure
      const transformedData = data.map((car) => ({
        ...car,
        specs: {
          transmission: car.transmission,
          fuel: car.fuel,
          doors: car.doors,
          luggage: car.luggage,
        },
        dailyPrice: car.daily_price,
        weeklyPrice: car.weekly_price,
      }));
      setCarCategories(transformedData);
    } catch (error) {
      console.error("Error loading rental cars:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use API data
  const displayCars = carCategories;

  const getColorClasses = (color) => {
    const colors = {
      blue: "border-blue-500 hover:shadow-blue-100",
      indigo: "border-indigo-500 hover:shadow-indigo-100",
      purple: "border-purple-500 hover:shadow-purple-100",
      green: "border-green-500 hover:shadow-green-100",
      amber: "border-amber-500 hover:shadow-amber-100",
      red: "border-red-500 hover:shadow-red-100",
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 pt-20">
            {t("services.carRentalTitle")}
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            {t("services.chooseVehicle")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("services.chooseDescription")}
          </p>
        </div>

        {/* Car Categories Grid */}
        <div className="space-y-12 mb-20">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">{t("services.loading")}</p>
            </div>
          ) : displayCars.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">
                {t("services.noAvailable")}
              </p>
            </div>
          ) : (
            displayCars.map((category, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden border-l-8 ${getColorClasses(
                  category.color,
                )} hover:shadow-2xl transition-all duration-300`}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image Gallery Section */}
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-2 p-6">
                      {category.images.map((image, idx) => (
                        <div
                          key={idx}
                          className="relative h-48 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                        >
                          <img
                            src={image}
                            alt={`${category.name} ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Information Section */}
                  <div className="p-8">
                    <div className="mb-6">
                      <p className="text-lg text-gray-600 mb-1">
                        {category.model}
                      </p>
                      <p className="text-gray-600">{category.description}</p>
                    </div>

                    {/* Technical Specs */}
                    <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t("services.transmission")}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {category.specs.transmission}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t("services.fuelType")}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {category.specs.fuel}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t("services.doors")}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {category.specs.doors}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-3">
                        {t("services.features")}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center text-gray-700"
                          >
                            <span className="text-green-500 mr-2 text-sm">
                              ✓
                            </span>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="border-t pt-6 mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {t("services.startingFrom")}
                          </p>
                          <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-bold text-blue-600">
                              {category.dailyPrice}
                              <span className="text-lg text-gray-500">
                                {t("services.perDay")}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              {t("services.or")} {category.weeklyPrice}
                              {t("services.perWeek")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/contact#contact"
                        className="block w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-center hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
                      >
                        {t("services.requestQuote")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("services.readyToRide")}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t("services.readyDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact#contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              {t("services.contactUs")}
            </Link>
          </div>
        </div>
      </div>
      <WhatsappContact />
      <PageEnd />
    </>
  );
}
