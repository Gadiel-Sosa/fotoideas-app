const BASE_URL = "http://localhost:3000/api";

export const getStats = async () => {
  const response = await fetch(`${BASE_URL}/dashboard/stats`);
  
  if (!response.ok) {
    throw new Error("Error al obtener estadísticas");
  }

  return await response.json();
};
