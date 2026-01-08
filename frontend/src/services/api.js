const API_URL = import.meta.env.VITE_API_URL || "/api";

// Helper to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

// Helper to create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Destinations
  getDestinations: async () => {
    const response = await fetch(`${API_URL}/destinations`);
    if (!response.ok) throw new Error("Failed to fetch destinations");
    return response.json();
  },

  getDestination: async (id) => {
    const response = await fetch(`${API_URL}/destinations/${id}`);
    if (!response.ok) throw new Error("Failed to fetch destination");
    return response.json();
  },

  createDestination: async (data) => {
    const response = await fetch(`${API_URL}/destinations`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create destination");
    return response.json();
  },

  updateDestination: async (id, data) => {
    const response = await fetch(`${API_URL}/destinations/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update destination");
    return response.json();
  },

  deleteDestination: async (id) => {
    const response = await fetch(`${API_URL}/destinations/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete destination");
    return response.json();
  },

  // Tours
  getTours: async (destination = null) => {
    const url = destination
      ? `${API_URL}/tours?destination=${encodeURIComponent(destination)}`
      : `${API_URL}/tours`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch tours");
    return response.json();
  },

  getTour: async (id) => {
    const response = await fetch(`${API_URL}/tours/${id}`);
    if (!response.ok) throw new Error("Failed to fetch tour");
    return response.json();
  },

  createTour: async (data) => {
    const response = await fetch(`${API_URL}/tours`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create tour");
    return response.json();
  },

  updateTour: async (id, data) => {
    const response = await fetch(`${API_URL}/tours/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update tour");
    return response.json();
  },

  deleteTour: async (id) => {
    const response = await fetch(`${API_URL}/tours/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete tour");
    return response.json();
  },

  // Tour Pricing
  getTourPricing: async (tourId) => {
    const response = await fetch(`${API_URL}/tours/${tourId}/pricing`);
    if (!response.ok) throw new Error("Failed to fetch tour pricing");
    return response.json();
  },

  createTourPricing: async (tourId, data) => {
    const response = await fetch(`${API_URL}/tours/${tourId}/pricing`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create pricing");
    return response.json();
  },

  updateTourPricing: async (tourId, pricingId, data) => {
    const response = await fetch(
      `${API_URL}/tours/${tourId}/pricing/${pricingId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("Failed to update pricing");
    return response.json();
  },

  deleteTourPricing: async (tourId, pricingId) => {
    const response = await fetch(
      `${API_URL}/tours/${tourId}/pricing/${pricingId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error("Failed to delete pricing");
    return response.json();
  },

  // Image Upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload image");
    return response.json();
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to change password");
    }
    return response.json();
  },

  // Rental Cars
  getRentalCars: async () => {
    const response = await fetch(`${API_URL}/rental-cars`);
    if (!response.ok) throw new Error("Failed to fetch rental cars");
    return response.json();
  },

  getRentalCar: async (id) => {
    const response = await fetch(`${API_URL}/rental-cars/${id}`);
    if (!response.ok) throw new Error("Failed to fetch rental car");
    return response.json();
  },

  createRentalCar: async (data) => {
    const response = await fetch(`${API_URL}/rental-cars`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create rental car");
    return response.json();
  },

  updateRentalCar: async (id, data) => {
    const response = await fetch(`${API_URL}/rental-cars/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update rental car");
    return response.json();
  },

  deleteRentalCar: async (id) => {
    const response = await fetch(`${API_URL}/rental-cars/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete rental car");
    return response.json();
  },

  // Gallery
  getGallery: async () => {
    const response = await fetch(`${API_URL}/gallery`);
    if (!response.ok) throw new Error("Failed to fetch gallery");
    return response.json();
  },

  addGalleryImage: async (file, title, description) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);

    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/gallery/image`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to add image");
    return response.json();
  },

  addGalleryVideo: async (url, title, description) => {
    const response = await fetch(`${API_URL}/gallery/video`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ url, title, description }),
    });
    if (!response.ok) throw new Error("Failed to add video");
    return response.json();
  },

  updateGalleryItem: async (id, title, description) => {
    const response = await fetch(`${API_URL}/gallery/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) throw new Error("Failed to update gallery item");
    return response.json();
  },

  deleteGalleryItem: async (id) => {
    const response = await fetch(`${API_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete gallery item");
    return response.json();
  },
};
