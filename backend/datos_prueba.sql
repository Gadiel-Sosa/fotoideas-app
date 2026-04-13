-- 1. Insertar Proveedores
-- ATENCIÓN: Esto limpiará las tablas y reiniciará los IDs a 1 para que no haya errores de duplicados.
TRUNCATE TABLE Venta, Corte_caja, Inventario, Producto, Proveedor, Credencial, Empleado, Sucursal RESTART IDENTITY CASCADE;

-- 1. Sucursal
INSERT INTO Sucursal (nombre_sucursal, correo_sucursal, direccion_sucursal, telefono_sucursal) 
VALUES ('Matriz', 'matriz@fotoideas.com', 'Centro 123', '5550000000');

-- 2. Empleado
INSERT INTO Empleado (id_sucursal, nombre_empleado, telefono_empleado, RFC_empleado, NSS_empleado)
VALUES (1, 'Juan Perez', '5551111111', 'JUANP12345678', '12345678901');

-- 3. Credencial (Contraseña de 8 a 12 caracteres)
INSERT INTO Credencial (id_empleado, username, contraseña_usuario, estado_credencial)
VALUES (1, 'admin_juan', 'password123', TRUE);

-- 4. Proveedor
INSERT INTO Proveedor (nombre_proveedor, telefono_proveedor, correo_proveedor, RFC_proveedor, nombre_empresa) 
VALUES ('Sony Mexico', '5551234567', 'contacto@sony.mx', 'SONY123456789', 'Sony');

-- 5. Producto
INSERT INTO Producto (nombre_producto, marca_producto, precio_venta, codigo_barras_producto) 
VALUES ('Cámara EOS T7', 'Canon', 12500.00, '1234567890123'),
       ('Lente 50mm', 'Sony', 5400.00, '1234567890124');

-- 6. Inventario (Relaciona Producto y Sucursal)
INSERT INTO Inventario (id_producto, id_sucursal, cantidad_inventario) 
VALUES (1, 1, 15),
       (2, 1, 5); -- Stock bajo para probar alertas

-- 7. Corte_caja (Necesario para hacer una venta)
INSERT INTO Corte_caja (id_empleado, fecha_corte, hora_corte, monto_inicial)
VALUES (1, CURRENT_DATE, CURRENT_TIME, 1000.00);

-- 8. Venta (Relaciona Corte de caja y Empleado)
INSERT INTO Venta (id_corte_caja, id_empleado, fecha_venta, hora_venta, total_venta, forma_pago) 
VALUES (1, 1, CURRENT_DATE, CURRENT_TIME, 12500.00, 'Efectivo');