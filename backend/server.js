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
      `SELECT c.id_credencial, c.id_empleado, e.nombre_empleado, r.id_rol, r.nombre_rol 
       FROM Credencial c 
       JOIN Empleado e ON c.id_empleado = e.id_empleado 
       LEFT JOIN Empleado_Rol er ON e.id_empleado = er.id_empleado
       LEFT JOIN Rol_user r ON er.id_rol = r.id_rol
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

// Endpoint para verificar credenciales de administrador (Para PIN de seguridad)
app.post('/api/verify-admin', async (req, res) => {
  const { pin } = req.body;

  try {
    const result = await pool.query(
      `SELECT id_rol 
       FROM Admin 
       WHERE pin_seguridad = $1`,
      [pin]
    );

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'PIN incorrecto o permisos insuficientes' });
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

// Registrar un nuevo proveedor
app.post('/api/proveedores', async (req, res) => {
  const { nombre_proveedor, nombre_empresa, telefono_proveedor, correo_proveedor, RFC_proveedor, direccion_proveedor } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Proveedor (nombre_proveedor, nombre_empresa, telefono_proveedor, correo_proveedor, RFC_proveedor, direccion_proveedor)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_proveedor`,
      [nombre_proveedor, nombre_empresa || null, telefono_proveedor || null, correo_proveedor || null, RFC_proveedor || null, direccion_proveedor || null]
    );
    res.json({ success: true, message: 'Proveedor registrado exitosamente', id_proveedor: result.rows[0].id_proveedor });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Error al registrar proveedor' });
  }
});

// Actualizar proveedor existente
app.put('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_proveedor, nombre_empresa, telefono_proveedor, correo_proveedor, RFC_proveedor, direccion_proveedor } = req.body;
  try {
    await pool.query(
      `UPDATE Proveedor 
       SET nombre_proveedor = $1, nombre_empresa = $2, telefono_proveedor = $3, correo_proveedor = $4, RFC_proveedor = $5, direccion_proveedor = $6
       WHERE id_proveedor = $7`,
      [nombre_proveedor, nombre_empresa || null, telefono_proveedor || null, correo_proveedor || null, RFC_proveedor || null, direccion_proveedor || null, id]
    );
    res.json({ success: true, message: 'Proveedor actualizado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Error al actualizar proveedor' });
  }
});

// Eliminar proveedor (Nota: Fallará de forma segura si tiene compras, gracias a las llaves foráneas de SQL)
app.delete('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Proveedor WHERE id_proveedor = $1', [id]);
    res.json({ success: true, message: 'Proveedor eliminado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'No se puede eliminar: el proveedor tiene compras o movimientos asociados.' });
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
    // Obtener el id_empleado desde la petición (si no llega, usa 1 por defecto)
    const id_empleado = req.query.id_empleado || 1;
    const empleadoResult = await pool.query(
      `SELECT id_empleado, nombre_empleado 
       FROM Empleado 
       WHERE id_empleado = $1`, [id_empleado]
    );

    // Obtener el corte de caja activo (que NO tenga efectivo_real, es decir, no esté cerrado)
    let corteResult = await pool.query(
      `SELECT id_corte_caja, monto_inicial, fecha_corte
       FROM Corte_caja 
       WHERE id_empleado = $1 AND efectivo_real IS NULL
       ORDER BY id_corte_caja DESC 
       LIMIT 1`,
      [empleadoResult.rows[0]?.id_empleado || 1]
    );

    let corteActivo = corteResult.rows[0];

    // Si no hay un turno abierto, lo creamos automáticamente en ceros
    if (!corteActivo) {
      const nuevoCorte = await pool.query(
        `INSERT INTO Corte_caja (id_empleado, fecha_corte, hora_corte, monto_inicial)
         VALUES ($1, CURRENT_DATE, CURRENT_TIME, 0) RETURNING id_corte_caja, monto_inicial, fecha_corte`,
        [empleadoResult.rows[0]?.id_empleado || 1]
      );
      corteActivo = nuevoCorte.rows[0];
    }

    // Obtener ventas asociadas únicamente a este turno/corte específico
    const ventasResult = await pool.query(
      `SELECT COALESCE(SUM(total_venta), 0) as total_ventas
       FROM Venta 
       WHERE id_corte_caja = $1`,
      [corteActivo.id_corte_caja]
    );

    const empleado = empleadoResult.rows[0];
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
    monto_inicial, // Recibido desde el frontend
    efectivo_real, 
    pago_proveedores, 
    observaciones_corte,
    id_empleado // Recibido desde el frontend
  } = req.body;

  try {
    const idEmp = id_empleado || 1;

    // Obtener ventas asociadas únicamente a este corte específico
    const ventasResult = await pool.query(
      `SELECT COALESCE(SUM(total_venta), 0) as total_ventas
       FROM Venta 
       WHERE id_corte_caja = $1`,
      [id_corte]
    );

    const ventasTotales = parseFloat(ventasResult.rows[0].total_ventas);
    
    // Determinar monto inicial (del frontend si se envió, si no, lo buscamos)
    let montoInicialFinal = parseFloat(monto_inicial) || 0;
    
    if (id_corte && montoInicialFinal === 0) {
      const corteActivoResult = await pool.query(
        `SELECT monto_inicial FROM Corte_caja 
         WHERE id_corte_caja = $1`,
        [id_corte]
      );
      if (corteActivoResult.rows.length > 0) {
        montoInicialFinal = parseFloat(corteActivoResult.rows[0].monto_inicial);
      }
    }

    const efectivoEsperado = montoInicialFinal + ventasTotales;
    const diferencia_caja = efectivo_real - efectivoEsperado;

    if (id_corte) {
      // Actualizar el corte existente con los valores finales
      await pool.query(
        `UPDATE Corte_caja 
         SET monto_inicial = $1,
             efectivo_esperado = $2,
             efectivo_real = $3,
             diferencia_caja = $4,
             pago_proveedores = $5,
             observaciones_corte = $6,
             hora_corte = CURRENT_TIME
         WHERE id_corte_caja = $7`,
        [montoInicialFinal, efectivoEsperado, efectivo_real, diferencia_caja, pago_proveedores, observaciones_corte, id_corte]
      );
    } else {
      // Si no existía un turno abierto, creamos el registro del corte
      await pool.query(
        `INSERT INTO Corte_caja 
         (id_empleado, monto_inicial, fecha_corte, hora_corte, efectivo_esperado, efectivo_real, diferencia_caja, pago_proveedores, observaciones_corte)
         VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, $3, $4, $5, $6, $7)`,
        [idEmp, montoInicialFinal, efectivoEsperado, efectivo_real, diferencia_caja, pago_proveedores, observaciones_corte]
      );
    }

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

// Obtener historial de cortes de caja (Para consultar)
app.get('/api/cortes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id_corte_caja, c.fecha_corte, c.hora_corte, c.monto_inicial, 
              c.efectivo_esperado, c.efectivo_real, c.diferencia_caja, 
              c.pago_proveedores, c.observaciones_corte, e.nombre_empleado as cajero
       FROM Corte_caja c
       JOIN Empleado e ON c.id_empleado = e.id_empleado
       WHERE c.efectivo_real IS NOT NULL
       ORDER BY c.id_corte_caja DESC`
    );
    res.json({ success: true, cortes: result.rows });
  } catch (error) {
    console.error("Error al obtener cortes de caja:", error);
    res.status(500).json({ success: false, error: "Error al obtener historial de cortes" });
  }
});

// Obtener historial de ventas (Para consultar)
app.get('/api/ventas', async (req, res) => {
  const { id_empleado, rol } = req.query;
  try {
    let query = 
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
       LEFT JOIN Cancelar_venta cv ON v.id_venta = cv.id_venta`;

    let params = [];
    if (rol && rol !== 'Admin' && rol !== 'Administrador') {
      query += ` WHERE v.id_empleado = $1 AND v.fecha_venta = CURRENT_DATE`;
      params.push(id_empleado || 1);
    }

    query += ` ORDER BY v.id_venta DESC`;

    const result = await pool.query(query, params);
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

        const qty = item.cantidad || 1;

        await client.query(
          `INSERT INTO Detalle_venta (id_venta, id_producto, cantidad_venta)
           VALUES ($1, $2, $3)`,
          [id_venta, id_prod, qty]
        );

        // Descontar la cantidad del inventario
        await client.query(
          `UPDATE Inventario SET cantidad_inventario = cantidad_inventario - $1 WHERE id_producto = $2 AND id_sucursal = 1`,
          [qty, id_prod]
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

    // 4. Regresar el stock al inventario
    const detalles = await client.query('SELECT id_producto, cantidad_venta FROM Detalle_venta WHERE id_venta = $1', [id]);
    for (const item of detalles.rows) {
      await client.query(
        `UPDATE Inventario SET cantidad_inventario = cantidad_inventario + $1 WHERE id_producto = $2 AND id_sucursal = 1`,
        [item.cantidad_venta, item.id_producto]
      );
    }

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

// ==========================================
// ENDPOINTS PARA USUARIOS / EMPLEADOS
// ==========================================

// Obtener todos los empleados y sus credenciales
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id_empleado, e.nombre_empleado, e.telefono_empleado, e.direccion_empleado, 
             e.fecha_nacimiento, e.rfc_empleado, e.nss_empleado, e.id_sucursal,
             c.id_credencial, c.username, c.estado_credencial,
             er.id_rol, r.nombre_rol
      FROM Empleado e
      LEFT JOIN Credencial c ON e.id_empleado = c.id_empleado
      LEFT JOIN Empleado_Rol er ON e.id_empleado = er.id_empleado
      LEFT JOIN Rol_user r ON er.id_rol = r.id_rol
      ORDER BY e.id_empleado DESC
    `);
    res.json({ success: true, usuarios: result.rows });
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
  }
});

// Crear un nuevo empleado y su credencial
app.post('/api/usuarios', async (req, res) => {
  const { nombre_empleado, telefono_empleado, direccion_empleado, fecha_nacimiento, rfc_empleado, nss_empleado, id_sucursal, username, password, id_rol } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Insertar Empleado
    const empRes = await client.query(
      `INSERT INTO Empleado (nombre_empleado, telefono_empleado, direccion_empleado, fecha_nacimiento, rfc_empleado, nss_empleado, id_sucursal)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_empleado`,
      [nombre_empleado, telefono_empleado || null, direccion_empleado || null, fecha_nacimiento || null, rfc_empleado || null, nss_empleado || null, id_sucursal || 1]
    );
    
    const id_empleado = empRes.rows[0].id_empleado;
    
    // 2. Insertar Credencial si se proporcionó usuario y contraseña
    if (username && password) {
      await client.query(
        `INSERT INTO Credencial (id_empleado, username, contraseña_usuario, estado_credencial)
         VALUES ($1, $2, $3, TRUE)`,
        [id_empleado, username, password]
      );
    }
    
    // 3. Insertar Rol
    if (id_rol) {
      await client.query(
        `INSERT INTO Empleado_Rol (id_empleado, id_rol) VALUES ($1, $2)`,
        [id_empleado, id_rol]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Usuario registrado exitosamente', id_empleado });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// Actualizar empleado y credencial
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_empleado, telefono_empleado, direccion_empleado, fecha_nacimiento, rfc_empleado, nss_empleado, username, password, estado_credencial, id_rol } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Actualizar Empleado
    await client.query(
      `UPDATE Empleado 
       SET nombre_empleado=$1, telefono_empleado=$2, direccion_empleado=$3, fecha_nacimiento=$4, rfc_empleado=$5, nss_empleado=$6
       WHERE id_empleado=$7`,
      [nombre_empleado, telefono_empleado || null, direccion_empleado || null, fecha_nacimiento || null, rfc_empleado || null, nss_empleado || null, id]
    );
    
    // Manejar credenciales
    if (username) {
      const credCheck = await client.query(`SELECT id_credencial FROM Credencial WHERE id_empleado=$1`, [id]);
      if (credCheck.rows.length > 0) {
         let query = `UPDATE Credencial SET username=$1, estado_credencial=$2`;
         let params = [username, estado_credencial !== undefined ? estado_credencial : true];
         
         if (password && password.trim() !== '') {
           query += `, contraseña_usuario=$3 WHERE id_empleado=$4`;
           params.push(password, id);
         } else {
           query += ` WHERE id_empleado=$3`;
           params.push(id);
         }
         await client.query(query, params);
      } else if (password) {
         await client.query(
          `INSERT INTO Credencial (id_empleado, username, contraseña_usuario, estado_credencial) VALUES ($1, $2, $3, $4)`,
          [id, username, password, estado_credencial !== undefined ? estado_credencial : true]
         );
      }
    }
    
    // Manejar Rol
    if (id_rol) {
      const rolCheck = await client.query(`SELECT id_rol FROM Empleado_Rol WHERE id_empleado=$1`, [id]);
      if (rolCheck.rows.length > 0) {
        await client.query(`UPDATE Empleado_Rol SET id_rol=$1 WHERE id_empleado=$2`, [id_rol, id]);
      } else {
        await client.query(
          `INSERT INTO Empleado_Rol (id_empleado, id_rol) VALUES ($1, $2)`,
          [id, id_rol]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// Dar de baja un usuario (Borrado lógico)
app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE Credencial SET estado_credencial = FALSE WHERE id_empleado = $1`, [id]);
    res.json({ success: true, message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    res.status(500).json({ success: false, error: 'Error al desactivar usuario' });
  }
});

// ==========================================
// ENDPOINTS PARA REPORTES
// ==========================================


// 1. Reporte de Ventas por periodo
app.get('/api/reportes/ventas', async (req, res) => {
  const { inicio, fin } = req.query;
  try {
    const result = await pool.query(
      `SELECT v.id_venta, v.fecha_venta, v.hora_venta, v.total_venta, v.forma_pago, e.nombre_empleado
       FROM Venta v
       JOIN Empleado e ON v.id_empleado = e.id_empleado
       WHERE v.fecha_venta BETWEEN $1 AND $2
       ORDER BY v.fecha_venta DESC, v.hora_venta DESC`,
      [inicio, fin]
    );
    res.json({ success: true, datos: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Reporte de Productos Más Vendidos
app.get('/api/reportes/mas-vendidos', async (req, res) => {
  const { inicio, fin } = req.query;
  try {
    const result = await pool.query(
      `SELECT p.codigo_barras_producto as codigo, p.nombre_producto as nombre, 
              SUM(dv.cantidad_venta) as total_vendido, 
              SUM(dv.cantidad_venta * p.precio_venta) as ingresos
       FROM Detalle_venta dv
       JOIN Producto p ON dv.id_producto = p.id_producto
       JOIN Venta v ON dv.id_venta = v.id_venta
       WHERE v.fecha_venta BETWEEN $1 AND $2
       GROUP BY p.id_producto
       ORDER BY total_vendido DESC
       LIMIT 15`,
      [inicio, fin]
    );
    res.json({ success: true, datos: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Reporte de Stock Bajo
app.get('/api/reportes/stock-bajo', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.codigo_barras_producto as codigo, p.nombre_producto as nombre, p.precio_venta, i.cantidad_inventario as stock
       FROM Producto p
       JOIN Inventario i ON p.id_producto = i.id_producto
       WHERE i.cantidad_inventario <= 10
       ORDER BY stock ASC`
    );
    res.json({ success: true, datos: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Reporte de Compras/Pagos a Proveedores
app.get('/api/reportes/compras-proveedor', async (req, res) => {
  const { inicio, fin } = req.query;
  try {
    const result = await pool.query(
      `SELECT c.id_corte_caja, c.fecha_corte, c.hora_corte, c.pago_proveedores, e.nombre_empleado 
       FROM Corte_caja c
       JOIN Empleado e ON c.id_empleado = e.id_empleado
       WHERE c.fecha_corte BETWEEN $1 AND $2 AND c.pago_proveedores > 0
       ORDER BY c.fecha_corte DESC`,
      [inicio, fin]
    );
    res.json({ success: true, datos: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});