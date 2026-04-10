import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableImage({ id, src, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group"
    >
      <img
        src={src}
        alt="Tour image"
        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
        draggable={false}
      />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(src)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Remove image"
      >
        ×
      </button>
    </div>
  );
}

export function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("destinations");
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [rentalCars, setRentalCars] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
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
  const [tourPricing, setTourPricing] = useState([]);
  const [newPricing, setNewPricing] = useState({
    min_persons: "",
    max_persons: "",
    price_per_person: "",
  });

  // Admin management state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    role: "admin",
    is_active: true,
  });
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminError, setAdminError] = useState("");

  const isSuperAdmin = user?.role === "super_admin";

  const sensors = useSensors(useSensor(PointerSensor));

  const loadData = async () => {
    try {
      const [destinationsData, toursData, rentalCarsData, galleryData] =
        await Promise.all([
          api.getDestinations(),
          api.getTours(),
          api.getRentalCars(),
          api.getGallery(),
        ]);
      setDestinations(destinationsData);
      setTours(toursData);
      setRentalCars(rentalCarsData);
      setGalleryItems(galleryData);

      // Load admin users and activity logs if super admin
      if (user?.role === "super_admin") {
        try {
          const [usersData, logsData] = await Promise.all([
            api.getAdminUsers(),
            api.getActivityLogs(50),
          ]);
          setAdminUsers(usersData);
          setActivityLogs(logsData);
        } catch (error) {
          console.error("Error loading admin data:", error);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data from server");
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Reload admin data when switching to admin tabs
  useEffect(() => {
    const loadAdminData = async () => {
      if (
        user?.role === "super_admin" &&
        (activeTab === "admin-users" || activeTab === "activity-logs")
      ) {
        try {
          const [usersData, logsData] = await Promise.all([
            api.getAdminUsers(),
            api.getActivityLogs(50),
          ]);
          setAdminUsers(usersData);
          setActivityLogs(logsData);
        } catch (error) {
          console.error("Error loading admin data:", error);
        }
      }
    };
    loadAdminData();
  }, [activeTab, user]);

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
        passwordData.newPassword,
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
          d.id === editingItem ? { ...d, ...updatedData } : d,
        ),
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
    if (formData.name && formData.destination) {
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
          price: "", // Legacy field - not used anymore
          duration: formData.duration || "N/A",
          images: imageUrls.join(","),
          overview: formData.overview || "",
          highlights: formData.highlights || "",
          included: formData.included || "",
          not_included: formData.not_included || "",
          itinerary: formData.itinerary || "",
          language: formData.language || "tr",
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
    loadTourPricing(tour.id);
  };

  const handleRemoveTourImage = (imageUrl) => {
    if (confirm("Are you sure you want to remove this image?")) {
      const currentImages = formData.images ? formData.images.split(",") : [];
      const updatedImages = currentImages.filter(
        (img) => img.trim() !== imageUrl.trim(),
      );
      setFormData({ ...formData, images: updatedImages.join(",") });
    }
  };

  const handleImageDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const imgs = (formData.images || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const oldIndex = imgs.indexOf(active.id);
    const newIndex = imgs.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(imgs, oldIndex, newIndex);
    setFormData({ ...formData, images: reordered.join(",") });
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

      console.log("Updating tour with data:", updatedData); // Debug log

      const response = await api.updateTour(editingItem, updatedData);
      console.log("Update response:", response); // Debug log

      setTours(
        tours.map((t) => (t.id === editingItem ? { ...t, ...updatedData } : t)),
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

  // Tour Pricing Functions
  const loadTourPricing = async (tourId) => {
    try {
      const pricing = await api.getTourPricing(tourId);
      setTourPricing(pricing);
    } catch (error) {
      console.error("Error loading pricing:", error);
      setTourPricing([]);
    }
  };

  const handleAddPricing = async (tourId) => {
    if (!newPricing.min_persons || !newPricing.price_per_person) {
      alert("Please fill in minimum persons and price per person");
      return;
    }
    try {
      const created = await api.createTourPricing(tourId, newPricing);
      setTourPricing([...tourPricing, created]);
      setNewPricing({ min_persons: "", max_persons: "", price_per_person: "" });
    } catch (error) {
      console.error("Error adding pricing:", error);
      alert("Failed to add pricing");
    }
  };

  const handleDeletePricing = async (tourId, pricingId) => {
    if (confirm("Are you sure you want to delete this pricing entry?")) {
      try {
        await api.deleteTourPricing(tourId, pricingId);
        setTourPricing(tourPricing.filter((p) => p.id !== pricingId));
      } catch (error) {
        console.error("Error deleting pricing:", error);
        alert("Failed to delete pricing");
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
            c.id === editingItem.id ? { ...carData, id: c.id } : c,
          ),
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
    setTourPricing([]);
    setNewPricing({ min_persons: "", max_persons: "", price_per_person: "" });
  };

  // Admin Management Functions
  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setAdminFormData({
      username: "",
      password: "",
      email: "",
      full_name: "",
      role: "admin",
      is_active: true,
    });
    setAdminError("");
    setShowAdminModal(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminFormData({
      ...admin,
      password: "", // Don't show existing password
    });
    setAdminError("");
    setShowAdminModal(true);
  };

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    setAdminError("");

    try {
      if (editingAdmin) {
        // Update existing admin
        const updateData = {
          username: adminFormData.username,
          email: adminFormData.email,
          full_name: adminFormData.full_name,
          role: adminFormData.role,
          is_active: adminFormData.is_active,
        };
        await api.updateAdminUser(editingAdmin.id, updateData);
        const updatedUsers = await api.getAdminUsers();
        setAdminUsers(updatedUsers);
        alert("Admin updated successfully");
      } else {
        // Create new admin
        await api.createAdminUser(adminFormData);
        const updatedUsers = await api.getAdminUsers();
        setAdminUsers(updatedUsers);
        alert("Admin created successfully");
      }
      setShowAdminModal(false);
    } catch (error) {
      setAdminError(error.message);
    }
  };

  const handleDeleteAdmin = async (adminId, username) => {
    if (confirm(`Are you sure you want to delete admin user: ${username}?`)) {
      try {
        await api.deleteAdminUser(adminId);
        const updatedUsers = await api.getAdminUsers();
        setAdminUsers(updatedUsers);
        alert("Admin deleted successfully");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleResetPassword = async (adminId, username) => {
    const newPassword = prompt(
      `Enter new password for ${username} (minimum 6 characters):`,
    );
    if (newPassword) {
      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }
      try {
        await api.resetAdminPassword(adminId, newPassword);
        alert("Password reset successfully");
      } catch (error) {
        alert(error.message);
      }
    }
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
                <span className="text-sm font-medium">
                  • Logged in as{" "}
                  <span className="text-amber-600">{user.username}</span>{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      user.role === "super_admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
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
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "gallery"
                ? "bg-purple-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Galeri ({galleryItems.length})
          </button>
          {isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab("admin-users")}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "admin-users"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Admin Users ({adminUsers.length})
              </button>
              <button
                onClick={() => setActiveTab("activity-logs")}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "activity-logs"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Activity Logs
              </button>
            </>
          )}
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
                    placeholder="Duration (e.g., 3 Nights / 4 Days)"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <select
                    value={formData.language || "tr"}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="tr">Turkish (Türkçe)</option>
                    <option value="en">English (İngilizce)</option>
                    <option value="de">German (Almanca)</option>
                    <option value="ru">Russian (Rusça)</option>
                    <option value="ar">Arabic (Arapça)</option>
                  </select>
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
                          placeholder="Duration"
                          value={formData.duration || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                        <select
                          value={formData.language || "tr"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              language: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="tr">Turkish (Türkçe)</option>
                          <option value="en">English (İngilizce)</option>
                          <option value="de">German (Almanca)</option>
                          <option value="ru">Russian (Rusça)</option>
                          <option value="ar">Arabic (Arapça)</option>
                          <option value="fr">French (Fransızca)</option>
                          <option value="es">Spanish (İspanyolca)</option>
                          <option value="it">Italian (İtalyanca)</option>
                          <option value="ja">Japanese (Japonca)</option>
                        </select>
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
                            Current Images
                          </label>
                          {formData.images && formData.images.trim() !== "" ? (
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={handleImageDragEnd}
                            >
                              <SortableContext
                                items={formData.images
                                  .split(",")
                                  .map((x) => x.trim())
                                  .filter(Boolean)}
                                strategy={rectSortingStrategy}
                              >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                  {formData.images
                                    .split(",")
                                    .map((x) => x.trim())
                                    .filter(Boolean)
                                    .map((img) => (
                                      <SortableImage
                                        key={img}
                                        id={img}
                                        src={img}
                                        onRemove={handleRemoveTourImage}
                                      />
                                    ))}
                                </div>
                              </SortableContext>
                            </DndContext>
                          ) : (
                            <p className="text-sm text-gray-500 mb-4">
                              No images uploaded yet
                            </p>
                          )}
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

                        {/* Pricing Management Section */}
                        <div className="md:col-span-2 border-t pt-4 mt-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            💰 Pricing by Group Size
                          </h4>

                          {/* Existing Pricing */}
                          {tourPricing.length > 0 ? (
                            <div className="space-y-2 mb-4">
                              {tourPricing.map((pricing) => (
                                <div
                                  key={pricing.id}
                                  className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-4">
                                    <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                                      {pricing.min_persons}
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                      {pricing.price_per_person}
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                      per person
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeletePricing(
                                        formData.id,
                                        pricing.id,
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800 font-semibold"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mb-4">
                              No pricing added yet
                            </p>
                          )}

                          {/* Add New Pricing */}
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-3">
                              Add New Pricing Entry
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                placeholder="Group size (e.g., 1-2 persons)"
                                value={newPricing.min_persons}
                                onChange={(e) =>
                                  setNewPricing({
                                    ...newPricing,
                                    min_persons: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                              />
                              <input
                                type="text"
                                placeholder="Price (e.g., 500 €)"
                                value={newPricing.price_per_person}
                                onChange={(e) =>
                                  setNewPricing({
                                    ...newPricing,
                                    price_per_person: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddPricing(formData.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold"
                              >
                                Add
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              💡 Enter custom text for group size (e.g., "1-2
                              persons", "3+ persons")
                            </p>
                          </div>
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

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Galeri Yönetimi</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsAdding(true);
                  setFormData({ type: "image", title: "", description: "" });
                }}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                + Fotoğraf Ekle
              </button>
              <button
                onClick={() => {
                  setIsAdding(true);
                  setFormData({
                    type: "video",
                    title: "",
                    description: "",
                    url: "",
                  });
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                + Video Ekle
              </button>
            </div>
          </div>

          {/* Add/Edit Form */}
          {isAdding && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-purple-200">
              <h3 className="text-xl font-bold mb-4">
                {formData.type === "image" ? "Fotoğraf" : "Video"} Ekle
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setUploading(true);

                  try {
                    if (formData.type === "image") {
                      if (!imageFile) {
                        alert("Lütfen bir fotoğraf seçin");
                        return;
                      }
                      await api.addGalleryImage(
                        imageFile,
                        formData.title,
                        formData.description,
                      );
                    } else {
                      await api.addGalleryVideo(
                        formData.url,
                        formData.title,
                        formData.description,
                      );
                    }

                    await loadData();
                    setIsAdding(false);
                    setFormData({});
                    setImageFile(null);
                    alert("Başarıyla eklendi!");
                  } catch (error) {
                    console.error("Error adding gallery item:", error);
                    alert("Eklerken bir hata oluştu: " + error.message);
                  } finally {
                    setUploading(false);
                  }
                }}
                className="space-y-4"
              >
                {formData.type === "image" ? (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Fotoğraf
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.url || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
                  >
                    {uploading ? "Yükleniyor..." : "Ekle"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setFormData({});
                      setImageFile(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div className="relative h-48">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg
                        viewBox="0 0 24 24"
                        width="60"
                        height="60"
                        fill="white"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {editingItem?.id === item.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Başlık"
                      />
                      <textarea
                        value={editingItem.description}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded"
                        rows="2"
                        placeholder="Açıklama"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await api.updateGalleryItem(
                                editingItem.id,
                                editingItem.title,
                                editingItem.description,
                              );
                              await loadData();
                              setEditingItem(null);
                              alert("Güncellendi!");
                            } catch (error) {
                              alert("Hata: " + error.message);
                            }
                          }}
                          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              confirm(
                                "Bu öğeyi silmek istediğinize emin misiniz?",
                              )
                            ) {
                              try {
                                await api.deleteGalleryItem(item.id);
                                await loadData();
                                alert("Silindi!");
                              } catch (error) {
                                alert("Hata: " + error.message);
                              }
                            }
                          }}
                          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {galleryItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Henüz galeri öğesi eklenmemiş.</p>
            </div>
          )}
        </div>
      )}

      {/* Admin Users Tab (Super Admin Only) */}
      {activeTab === "admin-users" && isSuperAdmin && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admin User Management</h2>
            <button
              onClick={handleAddAdmin}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add New Admin
            </button>
          </div>

          {/* Admin Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created At</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{admin.username}</td>
                    <td className="px-4 py-3">{admin.full_name || "-"}</td>
                    <td className="px-4 py-3">{admin.email || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          admin.role === "super_admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          admin.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleResetPassword(admin.id, admin.username)
                          }
                          className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm"
                          title="Reset Password"
                        >
                          Reset Pwd
                        </button>
                        {admin.id !== user.id && (
                          <button
                            onClick={() =>
                              handleDeleteAdmin(admin.id, admin.username)
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            title="Delete"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adminUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No admin users found.</p>
            </div>
          )}
        </div>
      )}

      {/* Activity Logs Tab (Super Admin Only) */}
      {activeTab === "activity-logs" && isSuperAdmin && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admin Activity Logs</h2>
            <button
              onClick={async () => {
                const logs = await api.getActivityLogs(50);
                setActivityLogs(logs);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Refresh
            </button>
          </div>

          {/* Activity Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Date/Time</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Details</th>
                  <th className="px-4 py-3 text-left">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{log.username}</div>
                        {log.full_name && (
                          <div className="text-xs text-gray-500">
                            {log.full_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {log.details || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {log.ip_address || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {activityLogs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No activity logs found.</p>
            </div>
          )}
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingAdmin ? "Edit Admin User" : "Create New Admin User"}
            </h2>

            {adminError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p className="text-sm">{adminError}</p>
              </div>
            )}

            <form onSubmit={handleSaveAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={adminFormData.username}
                  onChange={(e) =>
                    setAdminFormData({
                      ...adminFormData,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter username"
                  required
                />
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={adminFormData.password}
                    onChange={(e) =>
                      setAdminFormData({
                        ...adminFormData,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter password (min 6 characters)"
                    required={!editingAdmin}
                    minLength={6}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={adminFormData.full_name}
                  onChange={(e) =>
                    setAdminFormData({
                      ...adminFormData,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) =>
                    setAdminFormData({
                      ...adminFormData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={adminFormData.role}
                  onChange={(e) =>
                    setAdminFormData({
                      ...adminFormData,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {editingAdmin && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={adminFormData.is_active}
                    onChange={(e) =>
                      setAdminFormData({
                        ...adminFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-gray-700"
                  >
                    Account Active
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  {editingAdmin ? "Update Admin" : "Create Admin"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminError("");
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
