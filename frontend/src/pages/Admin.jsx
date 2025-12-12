import { useState, useEffect } from "react";
import { api } from "../services/api";

export function Admin() {
  const [activeTab, setActiveTab] = useState("destinations");
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [destinationsData, toursData] = await Promise.all([
        api.getDestinations(),
        api.getTours(),
      ]);
      setDestinations(destinationsData);
      setTours(toursData);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data from server");
    } finally {
      setLoading(false);
    }
  };

  // Image upload function
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600">Manage destinations and tours</p>
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
      </div>
    </div>
  );
}
