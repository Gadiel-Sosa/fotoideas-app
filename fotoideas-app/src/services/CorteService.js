import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:3000/api/corte";

export const obtenerDatosCorte = async () => {
  try {
    const response = await fetch(`${API_URL}/datos`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Error al obtener datos");
    }
    const data = await response.json();
    return data.datos;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const realizarCorte = async (datosCorte) => {
  try {
    const response = await fetch(`${API_URL}/realizar`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(datosCorte)
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Error al realizar corte");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
