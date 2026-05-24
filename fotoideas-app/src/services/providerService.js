import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:3000/api/proveedores";

export const getProviders = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
};

export const createProvider = async (providerData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(providerData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    throw error;
  }
};

export const updateProvider = async (id, providerData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(providerData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    throw error;
  }
};

export const deleteProvider = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    throw error;
  }
};
