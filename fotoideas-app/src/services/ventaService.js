const API_URL = "http://localhost:3000/api/ventas";

export const obtenerVentas = async () => {
  try {
    const response = await fetch(API_URL);
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
      headers: {
        "Content-Type": "application/json"
      },
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

export const cancelarVentaRealizada = async (idVenta) => {
  try {
    const response = await fetch(`${API_URL}/${idVenta}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
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