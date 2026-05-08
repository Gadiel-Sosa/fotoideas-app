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
    const result = await pool.query(`
      SELECT p.id_producto, p.codigo_barras_producto, p.nombre_producto, 
             p.marca_producto as categoria, p.descripcion, p.precio_venta as precio_publico,
             p.estado_producto as estado,
             COALESCE(i.cantidad_inventario, 0) as stock
      FROM Producto p
      LEFT JOIN Inventario i ON p.id_producto = i.id_producto
      ORDER BY p.id_producto DESC
    `);
    res.json({ success: true, productos: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Error al obtener productos' });
  }
});

// Registrar un nuevo producto en Inventario
app.post('/api/productos', async (req, res) => {
  const { codigo_barras, nombre, categoria, descripcion, precio_publico, stock, estado } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Iniciar transacción

    // 1. Insertamos en Producto (mapeando "categoria" a "marca_producto" del esquema)
    const prodResult = await client.query(
      `INSERT INTO Producto (nombre_producto, marca_producto, precio_venta, codigo_barras_producto, descripcion, estado_producto)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_producto`,
      [nombre, categoria || null, precio_publico || 0, codigo_barras || null, descripcion || null, estado || 'activo']
    );

    const idNuevoProducto = prodResult.rows[0].id_producto;

    // 2. Insertamos en la tabla Inventario (Asignado a la sucursal 1 por defecto temporalmente)
    await client.query(
      `INSERT INTO Inventario (id_producto, id_sucursal, cantidad_inventario)
       VALUES ($1, $2, $3)`,
      [idNuevoProducto, 1, stock || 0]
    );

    await client.query('COMMIT'); // Guardar permanentemente
    res.json({ success: true, message: 'Producto registrado', id_producto: idNuevoProducto });
  } catch (error) {
    await client.query('ROLLBACK'); // Revertir en caso de fallo
    console.error('Error al agregar producto:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// Actualizar un producto existente
app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { codigo_barras, nombre, categoria, descripcion, precio_publico, stock, estado } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Actualizar datos del producto
    await client.query(
      `UPDATE Producto 
       SET nombre_producto = $1, marca_producto = $2, precio_venta = $3, codigo_barras_producto = $4, descripcion = $5, estado_producto = $6
       WHERE id_producto = $7`,
      [nombre, categoria || null, precio_publico || 0, codigo_barras || null, descripcion || null, estado || 'activo', id]
    );

    // Actualizar cantidad en inventario
    await client.query(
      `UPDATE Inventario SET cantidad_inventario = $1 WHERE id_producto = $2 AND id_sucursal = 1`,
      [stock || 0, id]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Producto actualizado exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// Borrar (Dar de baja) un producto lógicamente
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Recibirá "inactivo"

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Borrado Lógico: cambiamos el estado y dejamos el stock en 0
    await client.query(`UPDATE Producto SET estado_producto = $1 WHERE id_producto = $2`, [estado || 'inactivo', id]);
    await client.query(`UPDATE Inventario SET cantidad_inventario = 0 WHERE id_producto = $1 AND id_sucursal = 1`, [id]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Producto dado de baja exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al borrar producto:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// Obtener todos los proveedores
app.get('/api/proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Proveedor ORDER BY id_proveedor DESC');
    res.json({ success: true, proveedores: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Error al obtener proveedores' });
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

// Obtener historial de ventas (Para consultar)
app.get('/api/ventas', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.id_venta, v.fecha_venta, v.hora_venta, v.total_venta, v.forma_pago, e.nombre_empleado,
              CASE WHEN cv.id_venta IS NOT NULL THEN 'Eliminada' ELSE 'Completada' END as estado_venta,
              (v.total_venta / 1.16) as subtotal_venta,
              (v.total_venta - (v.total_venta / 1.16)) as impuesto_iva,
              COALESCE(
                (SELECT json_agg(json_build_object('codigo', p.codigo_barras_producto, 'nombre', p.nombre_producto, 'cantidad', dv.cantidad_venta, 'precio', p.precio_venta))
                 FROM Detalle_venta dv
                 JOIN Producto p ON dv.id_producto = p.id_producto
                 WHERE dv.id_venta = v.id_venta), '[]'::json
              ) as lista_productos
       FROM Venta v
       JOIN Empleado e ON v.id_empleado = e.id_empleado
       LEFT JOIN Cancelar_venta cv ON v.id_venta = cv.id_venta
       ORDER BY v.id_venta DESC`
    );
    res.json({ success: true, ventas: result.rows });
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ success: false, error: "Error al obtener historial" });
  }
});

// Registrar (Guardar) una nueva venta
app.post('/api/ventas', async (req, res) => {
  const { id_corte_caja, id_empleado, total_venta, forma_pago, productos } = req.body;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Iniciar transacción segura
    
    // 1. Insertar la venta general
    const ventaResult = await client.query(
      `INSERT INTO Venta (id_corte_caja, id_empleado, fecha_venta, hora_venta, total_venta, forma_pago)
       VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, $3, $4) RETURNING id_venta`,
      [id_corte_caja, id_empleado, total_venta, forma_pago]
    );
    
    const id_venta = ventaResult.rows[0].id_venta;
    
    // 2. Insertar los detalles de la venta (productos cobrados)
    if (productos && productos.length > 0) {
      for (const item of productos) {
        let id_prod = item.id_producto || item.id;
        
        // Si solo tenemos el código de barras, buscamos el ID real en la BD
        if (!id_prod && item.codigo) {
           const resProd = await client.query('SELECT id_producto FROM Producto WHERE codigo_barras_producto = $1', [item.codigo]);
           if (resProd.rows.length > 0) {
             id_prod = resProd.rows[0].id_producto;
           }
        }

        await client.query(
          `INSERT INTO Detalle_venta (id_venta, id_producto, cantidad_venta)
           VALUES ($1, $2, $3)`,
          [id_venta, id_prod, item.cantidad || 1]
        );
      }
    }
    
    await client.query('COMMIT'); // Guardar cambios definitivamente
    res.json({ success: true, message: 'Venta registrada exitosamente', id_venta });
  } catch (error) {
    await client.query('ROLLBACK'); // Deshacer cambios si hubo error
    console.error('Error al registrar venta:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// Cancelar una venta ya realizada (Borrado Lógico)
app.delete('/api/ventas/:id', async (req, res) => {
  const { id } = req.params;
  const { motivo, id_rol } = req.body;
  
  if (!motivo || !id_rol) {
    return res.status(400).json({ success: false, error: "Faltan datos obligatorios (motivo o rol)" });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Verificar que la venta existe en primer lugar
    const checkVenta = await client.query('SELECT id_venta FROM Venta WHERE id_venta = $1', [id]);
    if (checkVenta.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: "Venta no encontrada" });
    }

    // 2. Verificar si ya se encuentra cancelada para no duplicar el registro
    const checkCancelada = await client.query('SELECT * FROM Cancelar_venta WHERE id_venta = $1', [id]);
    if (checkCancelada.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: "La venta ya se encuentra cancelada" });
    }

    // 3. Registrar la anulación insertando todos los campos requeridos en la tabla Cancelar_venta
    await client.query(
      `INSERT INTO Cancelar_venta (id_venta, id_rol, motivo_cancelar_venta, fecha_cancelar_venta, hora_cancelar_venta) 
       VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_TIME)`, 
      [id, id_rol, motivo]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: "Venta cancelada exitosamente" });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al cancelar la venta:", error);
    res.status(500).json({ success: false, error: "Error del servidor al cancelar venta" });
  } finally {
    client.release();
  }
});