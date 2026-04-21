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
// Obtener producto por código de barras
app.get('/api/productos/codigo/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        id_producto,
        nombre_producto,
        precio_venta,
        codigo_barras_producto
       FROM Producto
       WHERE codigo_barras_producto = $1`,
      [codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado"
      });
    }

    res.json({
      success: true,
      producto: result.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Error del servidor"
    });
  }
});


// Obtener datos para el corte de caja (ventas del turno, cajero, etc.)
app.get('/api/corte/datos', async (req, res) => {
  try {
    // Obtener el empleado actual (ejemplo: id_empleado = 1)
    const empleadoResult = await pool.query(
      `SELECT id_empleado, nombre_empleado 
       FROM Empleado 
       WHERE id_empleado = 1`  // Cambiar por el ID del usuario logueado
    );

    // Obtener el corte de caja activo (el último que no ha sido cerrado)
    const corteResult = await pool.query(
      `SELECT id_corte_caja, monto_inicial, fecha_corte
       FROM Corte_caja 
       WHERE id_empleado = $1 
       ORDER BY id_corte_caja DESC 
       LIMIT 1`,
      [empleadoResult.rows[0]?.id_empleado || 1]
    );

    // Obtener ventas del turno (ventas del día actual)
    const ventasResult = await pool.query(
      `SELECT COALESCE(SUM(total_venta), 0) as total_ventas
       FROM Venta 
       WHERE id_empleado = $1 
       AND fecha_venta = CURRENT_DATE`,
      [empleadoResult.rows[0]?.id_empleado || 1]
    );

    const empleado = empleadoResult.rows[0];
    const corteActivo = corteResult.rows[0];
    const ventasTotales = parseFloat(ventasResult.rows[0].total_ventas);
    const montoInicial = corteActivo ? parseFloat(corteActivo.monto_inicial) : 0;
    const efectivoEsperado = montoInicial + ventasTotales;

    res.json({
      success: true,
      datos: {
        id_corte: corteActivo?.id_corte_caja || null,
        cajero: empleado?.nombre_empleado || "Sin asignar",
        ventasTotales: ventasTotales,
        montoInicial: montoInicial,
        efectivoEsperado: efectivoEsperado
      }
    });

  } catch (error) {
    console.error("Error al obtener datos del corte:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Realizar corte de caja
app.post('/api/corte/realizar', async (req, res) => {
  const { 
    id_corte,
    efectivo_real, 
    pago_proveedores, 
    observaciones_corte 
  } = req.body;

  try {
    // Obtener el empleado actual
    const empleadoResult = await pool.query(
      `SELECT id_empleado FROM Empleado WHERE id_empleado = 1`
    );

    // Obtener ventas del turno y monto inicial
    const ventasResult = await pool.query(
      `SELECT COALESCE(SUM(total_venta), 0) as total_ventas
       FROM Venta 
       WHERE id_empleado = $1 
       AND fecha_venta = CURRENT_DATE`,
      [empleadoResult.rows[0].id_empleado]
    );

    const corteActivoResult = await pool.query(
      `SELECT monto_inicial FROM Corte_caja 
       WHERE id_corte_caja = $1`,
      [id_corte]
    );

    const ventasTotales = parseFloat(ventasResult.rows[0].total_ventas);
    const montoInicial = parseFloat(corteActivoResult.rows[0].monto_inicial);
    const efectivoEsperado = montoInicial + ventasTotales;
    const diferencia_caja = efectivo_real - efectivoEsperado;

    // Actualizar el corte con los valores finales
    await pool.query(
      `UPDATE Corte_caja 
       SET efectivo_esperado = $1,
           efectivo_real = $2,
           diferencia_caja = $3,
           pago_proveedores = $4,
           observaciones_corte = $5,
           hora_corte = CURRENT_TIME
       WHERE id_corte_caja = $6`,
      [efectivoEsperado, efectivo_real, diferencia_caja, pago_proveedores, observaciones_corte, id_corte]
    );

    res.json({
      success: true,
      message: "Corte realizado exitosamente",
      datos: {
        diferencia_caja: diferencia_caja
      }
    });

  } catch (error) {
    console.error("Error al realizar corte:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});