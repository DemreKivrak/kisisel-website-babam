const API_URL = "http://localhost:3001/api";

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create destination");
    return response.json();
  },

  updateDestination: async (id, data) => {
    const response = await fetch(`${API_URL}/destinations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update destination");
    return response.json();
  },

  deleteDestination: async (id) => {
    const response = await fetch(`${API_URL}/destinations/${id}`, {
      method: "DELETE",
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create tour");
    return response.json();
  },

  updateTour: async (id, data) => {
    const response = await fetch(`${API_URL}/tours/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update tour");
    return response.json();
  },

  deleteTour: async (id) => {
    const response = await fetch(`${API_URL}/tours/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete tour");
    return response.json();
  },
};
