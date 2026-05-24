import { getAuthHeaders, apiFetch } from "./authService";

const API_URL = "http://localhost:3000/api/ventas";

export const obtenerVentas = async (rol) => {
  try {
    const url = rol ? `${API_URL}?rol=${rol}` : API_URL;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error al obtener las ventas");
    }
    return data.ventas;
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    throw error;
  }
};

export const registrarVenta = async (ventaData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(ventaData)
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error al registrar la venta");
    }
    return data;
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    throw error;
  }
};

export const cancelarVentaRealizada = async (idVenta, motivo, id_rol) => {
  try {
    const response = await fetch(`${API_URL}/${idVenta}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ motivo, id_rol })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error al cancelar la venta");
    }
    return data;
  } catch (error) {
    console.error("Error en el servicio de ventas:", error);
    throw error;
  }
};