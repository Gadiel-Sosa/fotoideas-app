import express from 'express';
import cors from 'cors';
import pool from './db.js'; // ¡Ojo! En ES modules es obligatorio poner la extensión .js a tus propios archivos
import dotenv from 'dotenv';

dotenv.config();


const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend (React)
app.use(express.json()); // Permite recibir datos en formato JSON

// Ruta de prueba para verificar que la API funciona
app.get('/', (req, res) => {
  res.send('API de FotoIdeas funcionando');
});

// Endpoint para iniciar sesión
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Verificamos si el usuario y contraseña existen
    const result = await pool.query(
      `SELECT c.id_credencial, c.id_empleado, e.nombre_empleado 
       FROM Credencial c 
       JOIN Empleado e ON c.id_empleado = e.id_empleado 
       WHERE c.username = $1 AND c.contraseña_usuario = $2 AND c.estado_credencial = TRUE`,
      [username, password]
    );

    // 2. Si el login es exitoso (el usuario existe)
    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      // 3. AQUÍ HACEMOS LA AUDITORÍA: Insertamos el registro en la tabla Sesion
      // Como le pusimos DEFAULT a la fecha y hora en SQL, solo mandamos el ID
      await pool.query(
        `INSERT INTO Sesion (id_credencial) VALUES ($1)`,
        [user.id_credencial]
      );

      // Le damos acceso al usuario en el Frontend
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
});

// Ejemplo 1: Obtener productos reales de la tabla 'Producto' de tu BD
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Producto');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ejemplo 2: Datos para llenar las tarjetas del Dashboard consultando a Docker
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Ventas del día actual (usando tu tabla Venta)
    const ventasQuery = await pool.query('SELECT COALESCE(SUM(total_venta), 0) AS total FROM Venta WHERE fecha_venta = CURRENT_DATE');
    
    // Total de productos en inventario (usando tu tabla Inventario)
    const invQuery = await pool.query('SELECT COALESCE(SUM(cantidad_inventario), 0) AS total FROM Inventario');
    
    // Cantidad de proveedores (usando tu tabla Proveedor)
    const provQuery = await pool.query('SELECT COUNT(*) AS total FROM Proveedor');
    
    // Alertas (productos con inventario bajo, ej. menos de 10)
    const alertasQuery = await pool.query('SELECT COUNT(*) AS total FROM Inventario WHERE cantidad_inventario < 10');

    res.json({
      ventasDelDia: parseFloat(ventasQuery.rows[0].total),
      inventario: parseInt(invQuery.rows[0].total, 10),
      proveedores: parseInt(provQuery.rows[0].total, 10),
      alertas: parseInt(alertasQuery.rows[0].total, 10)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});