import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("destinations");
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [rentalCars, setRentalCars] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [destinationsData, toursData, rentalCarsData] = await Promise.all([
        api.getDestinations(),
        api.getTours(),
        api.getRentalCars(),
      ]);
      setDestinations(destinationsData);
      setTours(toursData);
      setRentalCars(rentalCarsData);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data from server");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
  };

  // Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      await api.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  // Image upload function
  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const data = await api.uploadImage(file);
      if (data.url) {
        return data.url;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Destination Functions
  const handleAddDestination = async () => {
    if (formData.name && formData.description) {
      try {
        let imageUrl = formData.img || "default.jpg";

        // Upload image if file is selected
        if (imageFile) {
          const uploadedUrl = await handleImageUpload(imageFile);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          }
        }

        const newDest = await api.createDestination({
          name: formData.name,
          description: formData.description,
          img: imageUrl,
          highlights: formData.highlights || "",
        });
        setDestinations([...destinations, newDest]);
        setFormData({});
        setImageFile(null);
        setIsAdding(false);
      } catch (error) {
        console.error("Error adding destination:", error);
        alert("Failed to add destination");
      }
    }
  };

  const handleEditDestination = (dest) => {
    setEditingItem(dest.id);
    setFormData(dest);
  };

  const handleUpdateDestination = async () => {
    try {
      let imageUrl = formData.img;

      // Upload new image if file is selected
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const updatedData = { ...formData, img: imageUrl };
      await api.updateDestination(editingItem, updatedData);
      setDestinations(
        destinations.map((d) =>
          d.id === editingItem ? { ...d, ...updatedData } : d
        )
      );
      setEditingItem(null);
      setFormData({});
      setImageFile(null);
    } catch (error) {
      console.error("Error updating destination:", error);
      alert("Failed to update destination");
    }
  };

  const handleDeleteDestination = async (id) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      try {
        await api.deleteDestination(id);
        setDestinations(destinations.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error deleting destination:", error);
        alert("Failed to delete destination");
      }
    }
  };

  // Tour Functions
  const handleAddTour = async () => {
    if (formData.name && formData.destination && formData.price) {
      try {
        let imageUrls = [];

        // Upload multiple images if files are selected
        if (imageFiles.length > 0) {
          setUploading(true);
          for (const file of imageFiles) {
            const uploadedUrl = await handleImageUpload(file);
            if (uploadedUrl) {
              imageUrls.push(uploadedUrl);
            }
          }
          setUploading(false);
        }

        const newTour = await api.createTour({
          name: formData.name,
          destination: formData.destination,
          price: formData.price,
          duration: formData.duration || "N/A",
          images: imageUrls.join(","),
          overview: formData.overview || "",
          highlights: formData.highlights || "",
          included: formData.included || "",
          not_included: formData.not_included || "",
          itinerary: formData.itinerary || "",
          is_recommended: formData.is_recommended || false,
        });
        setTours([...tours, newTour]);
        setFormData({});
        setImageFiles([]);
        setIsAdding(false);
      } catch (error) {
        console.error("Error adding tour:", error);
        alert("Failed to add tour");
      }
    }
  };

  const handleEditTour = (tour) => {
    setEditingItem(tour.id);
    setFormData(tour);
  };

  const handleUpdateTour = async () => {
    try {
      let imageUrls = formData.images ? formData.images.split(",") : [];

      // Upload new images if files are selected
      if (imageFiles.length > 0) {
        setUploading(true);
        for (const file of imageFiles) {
          const uploadedUrl = await handleImageUpload(file);
          if (uploadedUrl) {
            imageUrls.push(uploadedUrl);
          }
        }
        setUploading(false);
      }

      const updatedData = {
        ...formData,
        images: imageUrls.join(","),
      };

      await api.updateTour(editingItem, updatedData);
      setTours(
        tours.map((t) => (t.id === editingItem ? { ...t, ...updatedData } : t))
      );
      setEditingItem(null);
      setFormData({});
      setImageFiles([]);
    } catch (error) {
      console.error("Error updating tour:", error);
      alert("Failed to update tour");
    }
  };

  const handleDeleteTour = async (id) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      try {
        await api.deleteTour(id);
        setTours(tours.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Error deleting tour:", error);
        alert("Failed to delete tour");
      }
    }
  };

  // Rental Cars Functions
  const handleAddRentalCar = async () => {
    if (formData.model) {
      try {
        // Upload images if provided
        let imageUrls = [];
        if (imageFiles && imageFiles.length > 0) {
          for (const file of imageFiles) {
            const uploadedUrl = await handleImageUpload(file);
            if (uploadedUrl) {
              imageUrls.push(uploadedUrl);
            }
          }
        }

        const carData = {
          ...formData,
          images: imageUrls.length > 0 ? imageUrls : formData.images || [],
          features: formData.features || [],
        };

        const result = await api.createRentalCar(carData);
        const newCar = { ...carData, id: result.id };
        setRentalCars([...rentalCars, newCar]);
        handleCancel();
      } catch (error) {
        console.error("Error adding rental car:", error);
        alert("Failed to add rental car");
      }
    } else {
      alert("Please fill in model");
    }
  };

  const handleEditRentalCar = (car) => {
    setEditingItem(car);
    setFormData(car);
    setIsAdding(false);
  };

  const handleUpdateRentalCar = async () => {
    if (editingItem) {
      try {
        // Upload new images if provided
        let imageUrls = [...(formData.images || [])];
        if (imageFiles && imageFiles.length > 0) {
          for (const file of imageFiles) {
            const uploadedUrl = await handleImageUpload(file);
            if (uploadedUrl) {
              imageUrls.push(uploadedUrl);
            }
          }
        }

        const carData = {
          ...formData,
          images: imageUrls,
        };

        await api.updateRentalCar(editingItem.id, carData);
        setRentalCars(
          rentalCars.map((c) =>
            c.id === editingItem.id ? { ...carData, id: c.id } : c
          )
        );
        handleCancel();
      } catch (error) {
        console.error("Error updating rental car:", error);
        alert("Failed to update rental car");
      }
    }
  };

  const handleDeleteRentalCar = async (id) => {
    if (confirm("Are you sure you want to delete this rental car?")) {
      try {
        await api.deleteRentalCar(id);
        setRentalCars(rentalCars.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Error deleting rental car:", error);
        alert("Failed to delete rental car");
      }
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
    setFormData({});
    setImageFile(null);
    setImageFiles([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600">
              Manage destinations and tours{" "}
              {user && (
                <span className="text-sm text-amber-600 font-medium">
                  • Logged in as {user.username}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("destinations")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "destinations"
                ? "bg-amber-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Destinations ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab("tours")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "tours"
                ? "bg-amber-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tours ({tours.length})
          </button>
          <button
            onClick={() => setActiveTab("rental-cars")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "rental-cars"
                ? "bg-amber-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Rental Cars ({rentalCars.length})
          </button>
        </div>

        {/* Destinations Tab */}
        {activeTab === "destinations" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Destinations</h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
              >
                <span className="text-xl">+</span> Add New Destination
              </button>
            </div>

            {/* Add Form */}
            {isAdding && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Add New Destination</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 w-full"
                    />
                    {uploading && (
                      <p className="text-sm text-amber-600 mt-1">
                        Uploading image...
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 md:col-span-2"
                  />
                  <textarea
                    placeholder="Top Attractions (one per line)"
                    value={formData.highlights || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, highlights: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 md:col-span-2"
                    rows="4"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddDestination}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Destinations List */}
            <div className="space-y-4">
              {destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  {editingItem === dest.id ? (
                    <div>
                      <h3 className="text-xl font-bold mb-4">
                        Edit Destination
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={formData.name || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload New Image (optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 w-full"
                          />
                          {uploading && (
                            <p className="text-sm text-amber-600 mt-1">
                              Uploading image...
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Current: {formData.img}
                          </p>
                        </div>
                        <input
                          type="text"
                          value={formData.description || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 md:col-span-2"
                        />
                        <textarea
                          placeholder="Top Attractions (one per line)"
                          value={formData.highlights || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              highlights: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 md:col-span-2"
                          rows="4"
                        />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleUpdateDestination}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {dest.name}
                        </h3>
                        <p className="text-gray-600">{dest.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Image: {dest.img}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditDestination(dest)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDestination(dest.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tours Tab */}
        {activeTab === "tours" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tours</h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
              >
                <span className="text-xl">+</span> Add New Tour
              </button>
            </div>

            {/* Add Form */}
            {isAdding && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Add New Tour</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tour Name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <select
                    value={formData.destination || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select Destination</option>
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.name}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Price (e.g., 500 €)"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 3 Nights / 4 Days)"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <textarea
                    placeholder="Overview"
                    value={formData.overview || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, overview: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 md:col-span-2"
                    rows="3"
                  />
                  <textarea
                    placeholder="Highlights (one per line)"
                    value={formData.highlights || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, highlights: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    rows="4"
                  />
                  <textarea
                    placeholder="Included (one per line)"
                    value={formData.included || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, included: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    rows="4"
                  />
                  <textarea
                    placeholder="Not Included (one per line)"
                    value={formData.not_included || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, not_included: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    rows="4"
                  />
                  <textarea
                    placeholder="Itinerary - Format: Day 1 | Title | Description (each day on new line)"
                    value={formData.itinerary || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, itinerary: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 md:col-span-2"
                    rows="6"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images (Multiple)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setImageFiles(Array.from(e.target.files))
                      }
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 w-full"
                    />
                    {imageFiles.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {imageFiles.length} file(s) selected
                      </p>
                    )}
                    {uploading && (
                      <p className="text-sm text-amber-600 mt-1">
                        Uploading images...
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_recommended || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_recommended: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Add to Recommended Tours (Homepage)
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddTour}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Tours List */}
            <div className="space-y-4">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  {editingItem === tour.id ? (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Edit Tour</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={formData.name || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                        <select
                          value={formData.destination || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              destination: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select Destination</option>
                          {destinations.map((dest) => (
                            <option key={dest.id} value={dest.name}>
                              {dest.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={formData.price || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          value={formData.duration || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                        <textarea
                          placeholder="Overview"
                          value={formData.overview || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              overview: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 md:col-span-2"
                          rows="3"
                        />
                        <textarea
                          placeholder="Highlights (one per line)"
                          value={formData.highlights || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              highlights: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                          rows="4"
                        />
                        <textarea
                          placeholder="Included (one per line)"
                          value={formData.included || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              included: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                          rows="4"
                        />
                        <textarea
                          placeholder="Not Included (one per line)"
                          value={formData.not_included || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              not_included: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                          rows="4"
                        />
                        <textarea
                          placeholder="Itinerary - Format: Day 1 | Title | Description (each day on new line)"
                          value={formData.itinerary || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itinerary: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 md:col-span-2"
                          rows="6"
                        />
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add More Images (Multiple)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              setImageFiles(Array.from(e.target.files))
                            }
                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 w-full"
                          />
                          {formData.images && (
                            <p className="text-xs text-gray-500 mt-1">
                              Current images:{" "}
                              {formData.images.split(",").length}
                            </p>
                          )}
                          {imageFiles.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              {imageFiles.length} new file(s) selected
                            </p>
                          )}
                          {uploading && (
                            <p className="text-sm text-amber-600 mt-1">
                              Uploading images...
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.is_recommended || false}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  is_recommended: e.target.checked,
                                })
                              }
                              className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Add to Recommended Tours (Homepage)
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleUpdateTour}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {tour.name}
                        </h3>
                        <div className="flex gap-4 text-gray-600 mt-2">
                          <span>📍 {tour.destination}</span>
                          <span>💰 {tour.price}</span>
                          <span>🕐 {tour.duration}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTour(tour)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rental Cars Tab */}
        {activeTab === "rental-cars" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Rental Cars</h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
              >
                <span className="text-xl">+</span> Add New Rental Car
              </button>
            </div>

            {/* Add Form */}
            {isAdding && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Add New Rental Car</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Model (e.g., Fiat Egea or similar)"
                    value={formData.model || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="border p-3 rounded-lg col-span-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="border p-3 rounded-lg col-span-2"
                    rows="3"
                  />

                  <div className="col-span-2 grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Transmission (e.g., Automatic)"
                      value={formData.transmission || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transmission: e.target.value,
                        })
                      }
                      className="border p-3 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Fuel Type (e.g., Diesel)"
                      value={formData.fuel || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fuel: e.target.value })
                      }
                      className="border p-3 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Doors (e.g., 4 Doors)"
                      value={formData.doors || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, doors: e.target.value })
                      }
                      className="border p-3 rounded-lg"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Daily Price (e.g., €55)"
                    value={formData.daily_price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, daily_price: e.target.value })
                    }
                    className="border p-3 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Weekly Price (e.g., €330)"
                    value={formData.weekly_price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, weekly_price: e.target.value })
                    }
                    className="border p-3 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Color (e.g., blue, red)"
                    value={formData.color || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="border p-3 rounded-lg"
                  />

                  <div className="col-span-2">
                    <label className="block mb-2 font-semibold">
                      Features (one per line)
                    </label>
                    <textarea
                      placeholder="5 Passengers&#10;Premium Comfort&#10;GPS Navigation"
                      value={
                        Array.isArray(formData.features)
                          ? formData.features.join("\n")
                          : formData.features || ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          features: e.target.value
                            .split("\n")
                            .filter((f) => f.trim()),
                        })
                      }
                      className="border p-3 rounded-lg w-full"
                      rows="4"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block mb-2 font-semibold">Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        setImageFiles(Array.from(e.target.files))
                      }
                      className="border p-3 rounded-lg w-full"
                    />
                    {uploading && (
                      <p className="text-blue-500 mt-2">Uploading...</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddRentalCar}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    disabled={uploading}
                  >
                    Add Car
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Cars List */}
            <div className="space-y-4">
              {rentalCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {editingItem?.id === car.id ? (
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Edit Rental Car
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Model"
                          value={formData.model || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, model: e.target.value })
                          }
                          className="border p-3 rounded-lg col-span-2"
                        />
                        <textarea
                          placeholder="Description"
                          value={formData.description || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="border p-3 rounded-lg col-span-2"
                          rows="3"
                        />

                        <div className="col-span-2 grid grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="Transmission"
                            value={formData.transmission || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                transmission: e.target.value,
                              })
                            }
                            className="border p-3 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Fuel Type"
                            value={formData.fuel || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, fuel: e.target.value })
                            }
                            className="border p-3 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Doors"
                            value={formData.doors || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                doors: e.target.value,
                              })
                            }
                            className="border p-3 rounded-lg"
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Daily Price"
                          value={formData.daily_price || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              daily_price: e.target.value,
                            })
                          }
                          className="border p-3 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Weekly Price"
                          value={formData.weekly_price || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              weekly_price: e.target.value,
                            })
                          }
                          className="border p-3 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Color"
                          value={formData.color || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, color: e.target.value })
                          }
                          className="border p-3 rounded-lg"
                        />

                        <div className="col-span-2">
                          <label className="block mb-2 font-semibold">
                            Features
                          </label>
                          <textarea
                            value={
                              Array.isArray(formData.features)
                                ? formData.features.join("\n")
                                : formData.features || ""
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                features: e.target.value
                                  .split("\n")
                                  .filter((f) => f.trim()),
                              })
                            }
                            className="border p-3 rounded-lg w-full"
                            rows="4"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block mb-2 font-semibold">
                            Add More Images
                          </label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              setImageFiles(Array.from(e.target.files))
                            }
                            className="border p-3 rounded-lg w-full"
                          />
                          {uploading && (
                            <p className="text-blue-500 mt-2">Uploading...</p>
                          )}
                          {formData.images && formData.images.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                Current images: {formData.images.length}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleUpdateRentalCar}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                          disabled={uploading}
                        >
                          Update Car
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{car.icon}</span>
                          <h3 className="text-xl font-bold text-gray-800">
                            {car.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-1">{car.model}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {car.description}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>💰 {car.daily_price}/day</span>
                          <span>📅 {car.weekly_price}/week</span>
                          <span>⚙️ {car.transmission}</span>
                          <span>⛽ {car.fuel}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRentalCar(car)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRentalCar(car.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Change Password
              </h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordSuccess(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {passwordSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                <p className="font-semibold">
                  ✓ Password changed successfully!
                </p>
              </div>
            )}

            {passwordError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{passwordError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setPasswordSuccess(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
