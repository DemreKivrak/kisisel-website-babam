const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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
};
