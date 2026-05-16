const API_URL = "http://localhost:3000/api/proveedores";

// OBTENER TODOS LOS PROVEEDORES
export const getProviders = async () => {

  try {

    const response = await fetch(API_URL);

    const data = await response.json();

    return data;

  } catch (error) {

    console.error("Error al obtener proveedores:", error);

    throw error;
  }
};

// CREAR PROVEEDOR
export const createProvider = async (providerData) => {

  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(providerData)

    });

    const data = await response.json();

    return data;

  } catch (error) {

    console.error("Error al crear proveedor:", error);

    throw error;
  }
};

// ACTUALIZAR PROVEEDOR
export const updateProvider = async (id, providerData) => {

  try {

    const response = await fetch(`${API_URL}/${id}`, {

      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(providerData)

    });

    const data = await response.json();

    return data;

  } catch (error) {

    console.error("Error al actualizar proveedor:", error);

    throw error;
  }
};

// ELIMINAR PROVEEDOR
export const deleteProvider = async (id) => {

  try {

    const response = await fetch(`${API_URL}/${id}`, {

      method: "DELETE"

    });

    const data = await response.json();

    return data;

  } catch (error) {

    console.error("Error al eliminar proveedor:", error);

    throw error;
  }
};

