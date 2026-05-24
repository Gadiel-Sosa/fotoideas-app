import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:3000/api/productos";

export const getProductoPorCodigo = async (codigo) => {
  const res = await fetch(`${API_URL}/codigo/${codigo}`, {
    headers: getAuthHeaders()
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Producto no encontrado");
  }

  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.error || "Error al obtener producto");
  }
  
  if (!data.producto) {
    throw new Error("Producto no encontrado");
  }
  
  return data.producto;
};