const API_BASE = "http://localhost:3000/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    throw new Error("Sesión expirada o no autorizada");
  }

  return response.json();
};
