const API_URL = "http://localhost:3000/api/productos";

export const getProductoPorCodigo = async (codigo) => {
  // Paso 1: Hacer la petición
  const res = await fetch(`${API_URL}/codigo/${codigo}`);

  // Paso 2: Verificar si la respuesta es exitosa
  if (!res.ok) {
    throw new Error("Producto no encontrado");
  }

  // Paso 3: Obtener los datos
  const data = await res.json();
  
  // Paso 4: Verificar que la data tenga la estructura esperada
  if (!data.success) {
    throw new Error(data.error || "Error al obtener producto");
  }
  
  // Paso 5: Verificar que el producto exista
  if (!data.producto) {
    throw new Error("Producto no encontrado");
  }
  
  // Paso 6: Retornar el producto
  return data.producto;
};