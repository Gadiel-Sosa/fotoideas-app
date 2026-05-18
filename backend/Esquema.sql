CREATE TABLE Sucursal (
    id_sucursal SERIAL PRIMARY KEY,
    nombre_sucursal VARCHAR(100) NOT NULL,
    correo_sucursal VARCHAR(100),
    direccion_sucursal TEXT,
    telefono_sucursal VARCHAR(10)
);

CREATE TABLE Producto (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    marca_producto VARCHAR(50),
    precio_venta DECIMAL(10,2) NOT NULL,
    codigo_barras_producto VARCHAR(13) UNIQUE,
    descripcion TEXT,
    estado_producto VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE Proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL,
    telefono_proveedor VARCHAR(20),
    correo_proveedor VARCHAR(100),
    RFC_proveedor VARCHAR(20) UNIQUE,
    nombre_empresa VARCHAR(100),
    direccion_proveedor TEXT
);

CREATE TABLE Tipo_movimiento (
    id_tipo_movimiento SERIAL PRIMARY KEY,
    descripcion TEXT 
);

CREATE TABLE Rol_user (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(20) NOT NULL
);

CREATE TABLE Admin (
    id_rol SERIAL PRIMARY KEY REFERENCES Rol_user(id_rol),
    pin_seguridad VARCHAR(4) NOT NULL
);

CREATE TABLE Empleado (
    id_empleado SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    nombre_empleado VARCHAR(100) NOT NULL,
    telefono_empleado VARCHAR(20),
    direccion_empleado TEXT,
    fecha_nacimiento DATE,
    RFC_empleado VARCHAR(13) UNIQUE,
    NSS_empleado VARCHAR(11) UNIQUE,
    FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id_sucursal)
);

CREATE TABLE Credencial (
    id_credencial SERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    contraseña_usuario VARCHAR(12) NOT NULL,
    estado_credencial BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado),
    CONSTRAINT chk_contraseña_long CHECK (LENGTH(contraseña_usuario) BETWEEN 8 AND 12)
);

CREATE TABLE Corte_caja (
    id_corte_caja SERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL,
    fecha_corte DATE NOT NULL,
    hora_corte TIME NOT NULL,
    monto_inicial DECIMAL(10,2),
    ventas_totales DECIMAL(10,2),
    pago_proveedores DECIMAL(10,2),
    efectivo_esperado DECIMAL(10,2),
    efectivo_real DECIMAL(10,2),
    diferencia_caja DECIMAL(10,2),
    observaciones_corte TEXT,
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);

CREATE TABLE Venta (
    id_venta SERIAL PRIMARY KEY,
    id_corte_caja INTEGER NOT NULL,
    id_empleado INTEGER NOT NULL,
    fecha_venta DATE NOT NULL,
    hora_venta TIME NOT NULL,
    total_venta DECIMAL(10,2) NOT NULL,
    forma_pago VARCHAR(15),
    FOREIGN KEY (id_corte_caja) REFERENCES Corte_caja(id_corte_caja),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);

CREATE TABLE Abastecimiento (
    id_compra SERIAL PRIMARY KEY,
    id_proveedor INTEGER NOT NULL,
    fecha_abastecimiento DATE NOT NULL,
    hora_abastecimiento TIME NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor)
);

CREATE TABLE Detalle_venta (
    id_detalle_venta SERIAL PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad_venta INTEGER NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

CREATE TABLE Inventario (
    id_inventario SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    id_sucursal INTEGER NOT NULL,
    cantidad_inventario INTEGER NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id_sucursal)
);

CREATE TABLE Detalle_compra (
    id_detalle_compra SERIAL PRIMARY KEY,
    id_compra INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad_producto_compra INTEGER NOT NULL,
    precio_compra DECIMAL(10,2),
    FOREIGN KEY (id_compra) REFERENCES Abastecimiento(id_compra),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

CREATE TABLE Movimiento_producto (
    id_movimiento SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    id_sucursal INTEGER NOT NULL,
    id_tipo_movimiento INTEGER NOT NULL, 
    cantidad INTEGER NOT NULL,
    fecha_movimiento DATE NOT NULL,
    observacion TEXT,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
    FOREIGN KEY (id_rol) REFERENCES Rol_user(id_rol),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id_sucursal),
    FOREIGN KEY (id_tipo_movimiento) REFERENCES Tipo_movimiento(id_tipo_movimiento)
);

CREATE TABLE Cancelar_venta (
    id_cancelar_venta SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL,
    id_venta INTEGER NOT NULL UNIQUE,
    motivo_cancelar_venta TEXT,
    fecha_cancelar_venta DATE NOT NULL,
    hora_cancelar_venta TIME NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Rol_user(id_rol),
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta)
);

CREATE TABLE Movimiento_proveedor (
    id_movimiento_proveedor SERIAL PRIMARY KEY,
    id_proveedor INTEGER NOT NULL,
    id_sucursal INTEGER NOT NULL,
    id_rol INTEGER NOT NULL, 
    id_empleado INTEGER NOT NULL,
    id_tipo_movimiento INTEGER NOT NULL,
    estatus_proveedor VARCHAR(20),
    fecha_movimiento_proveedor DATE NOT NULL,
    hora_movimiento_proveedor TIME NOT NULL,
    observacion_proveedor TEXT,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id_sucursal),
    FOREIGN KEY (id_rol) REFERENCES Rol_user(id_rol),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY (id_tipo_movimiento) REFERENCES Tipo_movimiento(id_tipo_movimiento)
);

CREATE TABLE Sesion (
    id_login SERIAL PRIMARY KEY,
    id_credencial INTEGER NOT NULL,
    fecha_inicio_sesion DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_inicio_sesion TIME NOT NULL DEFAULT CURRENT_TIME,
    FOREIGN KEY (id_credencial) REFERENCES Credencial(id_credencial)
);

CREATE TABLE Empleado_Rol (
    id_rol INTEGER NOT NULL,
    id_empleado INTEGER NOT NULL,
    PRIMARY KEY (id_rol, id_empleado),
    FOREIGN KEY (id_rol) REFERENCES Rol_user(id_rol),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);

-- ==========================================================
-- SCRIPT DE DATOS INICIALES (Población de la BD) - FotoIdeas
-- ==========================================================

-- 1. CREACIÓN DE LA SUCURSAL (Obligatorio para inventario y empleados)
INSERT INTO Sucursal (nombre_sucursal, direccion_sucursal) 
VALUES ('Sucursal Matriz Centro', 'Calle 60 #123, Centro, Mérida, Yucatán');

-- 2. CREACIÓN DE LOS ROLES DEL SISTEMA
INSERT INTO Rol_user (nombre_rol) 
VALUES ('Administrador'), ('Empleado');

-- 3. CONFIGURACIÓN DEL PIN DE SEGURIDAD PARA EL ADMIN (Para autorizar cancelaciones)
-- OJO: Aquí estoy asignando el PIN '2026' al rol de Administrador (id_rol = 1)
INSERT INTO Admin (pin_seguridad, id_rol) 
VALUES ('2026', 1);

-- 4. ALTA DE EMPLEADOS (Como lo pusimos en el Manual)
INSERT INTO Empleado (nombre_empleado, telefono_empleado, direccion_empleado, rfc_empleado, id_sucursal) 
VALUES 
('Carlos Gerente', '9991234567', 'Norte Mérida', 'CAGX801231XXX', 1),
('Maria Ventas', '9997654321', 'Sur Mérida', 'MAVX951015XXX', 1);

-- 5. ASIGNACIÓN DE CREDENCIALES (Login)
INSERT INTO Credencial (id_empleado, username, contraseña_usuario, estado_credencial) 
VALUES 
(1, 'carlos_ger', 'adminpass1', TRUE),
(2, 'maria_ventas', 'ventas2026', TRUE);

-- 6. ASIGNACIÓN DE ROLES A LOS EMPLEADOS
INSERT INTO Empleado_Rol (id_empleado, id_rol) 
VALUES 
(1, 1), -- Carlos es Administrador (Rol 1)
(2, 2); -- Maria es Empleada (Rol 2)

-- 7. CATÁLOGO DE PROVEEDORES
INSERT INTO Proveedor (nombre_proveedor, nombre_empresa, telefono_proveedor, correo_proveedor, RFC_proveedor) 
VALUES 
('Juan Perez', 'Sony Mexico', '5551234567', 'contacto@sony.mx', 'SONY123456MX1'),
('Luis Gomez', 'Canon Latam', '5559876543', 'ventas@canon.com', 'CANO987654LA2'),
('Armando Casas', 'Manfrotto Dist.', '5557778899', 'ventas@manfrotto.com', 'MANF998877XX3');

-- 8. CATÁLOGO DE PRODUCTOS (Con códigos de barra listos para tu ScannerInput)
INSERT INTO Producto (nombre_producto, marca_producto, precio_venta, codigo_barras_producto, descripcion, estado_producto) 
VALUES 
('Cámara Alpha a7 III', 'Sony', 35000.00, '750100000001', 'Cámara Mirrorless Full-Frame 24.2 MP', 'activo'),
('Lente 50mm f/1.8 STM', 'Canon', 3500.00, '750100000002', 'Lente fijo ideal para retratos', 'activo'),
('Memoria SD Extreme 64GB', 'SanDisk', 600.00, '750100000003', 'Memoria SDXC UHS-I V30', 'activo'),
('Trípode Compact Action', 'Manfrotto', 1500.00, '750100000004', 'Trípode de aluminio para foto y video', 'activo'),
('Mochila ProTactic BP', 'Lowepro', 3200.00, '750100000005', 'Mochila táctica para equipo fotográfico', 'activo'),
('Panel Luz LED RGB', 'Godox', 1200.00, '750100000006', 'Luz continua para estudio', 'activo');

-- 9. INVENTARIO INICIAL (Asignado a la sucursal 1)
INSERT INTO Inventario (id_producto, id_sucursal, cantidad_inventario) 
VALUES 
(1, 1, 5),   -- 5 Cámaras Sony
(2, 1, 12),  -- 12 Lentes Canon
(3, 1, 25),  -- 25 Memorias (Buen stock)
(4, 1, 8),   -- 8 Trípodes
(5, 1, 4),   -- 4 Mochilas (Stock bajo, probará tus alertas)
(6, 1, 15);  -- 15 Luces LED