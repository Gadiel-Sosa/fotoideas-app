CREATE TABLE Sucursal (
    id_sucursal SERIAL PRIMARY KEY,
    nombre_sucursal VARCHAR(20) NOT NULL,
    correo_sucursal VARCHAR(20),
    direccion_sucursal TEXT,
    telefono_sucursal VARCHAR(10)
);

CREATE TABLE Producto (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(20) NOT NULL,
    marca_producto VARCHAR(20),
    precio_venta DECIMAL(10,2) NOT NULL,
    codigo_barras_producto VARCHAR(13) UNIQUE,
    descripcion TEXT
);

CREATE TABLE Proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre_proveedor VARCHAR(20) NOT NULL,
    telefono_proveedor VARCHAR(10),
    correo_proveedor VARCHAR(20),
    RFC_proveedor VARCHAR(13) UNIQUE,
    nombre_empresa VARCHAR(20),
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
    nombre_empleado VARCHAR(20) NOT NULL,
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
    username VARCHAR(20) NOT NULL UNIQUE,
    contraseña_usuario VARCHAR(12) NOT NULL,
    estado_credencial BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado),
    CONSTRAINT chk_contraseña_long CHECK (LENGTH(contraseña_usuario) BETWEEN 8 AND 12)
);

CREATE TABLE Corte_caja (
    id_corte_caja SERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL UNIQUE,
    fecha_corte DATE NOT NULL,
    hora_corte TIME NOT NULL,
    monto_inicial DECIMAL(10,2),
    ventas_totales DECIMAL(10,2),
    pago_proveedores DECIMAL(10,2),
    efectivo_esperado DECIMAL(10,2),
    efectivo_real DECIMAL(10,2),
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
    hora_abastecimeinto TIME NOT NULL,
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
    fecha_movimeinto DATE NOT NULL,
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
    id_credencial INTEGER NOT NULL UNIQUE,
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


