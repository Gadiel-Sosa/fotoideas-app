const API_URL = "http://localhost:3000/api/corte";

// Obtener datos para el corte
export const obtenerDatosCorte = async () => {
  try {
    const response = await fetch(`${API_URL}/datos`);
    if (!response.ok) throw new Error("Error al obtener datos");
    const data = await response.json();
    return data.datos;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Realizar corte de caja
export const realizarCorte = async (datosCorte) => {
  try {
    const response = await fetch(`${API_URL}/realizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosCorte)
    });
    if (!response.ok) throw new Error("Error al realizar corte");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};