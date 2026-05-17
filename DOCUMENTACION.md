# Documentación Técnica y Funcional del Sistema "FotoIdeas"

## 1. Introducción y Propósito del Proyecto
El proyecto **FotoIdeas** es una plataforma de gestión administrativa y de Punto de Venta (POS) diseñada para optimizar procesos comerciales. Permite la administración del inventario, la gestión de ventas, el control de empleados, la autenticación segura y el arqueo o "corte de caja" de los turnos de trabajo.

## 2. Arquitectura del Sistema
El sistema se basa en una arquitectura **Cliente-Servidor** clásica, dividida principalmente en tres capas:

1.  **Frontend (Capa de Presentación):** Desarrollada como una Single Page Application (SPA) utilizando React. Se encarga de la interfaz de usuario, la validación en cliente, el manejo de estados locales y de comunicarse con el servidor vía peticiones HTTP (Fetch API).
2.  **Backend (Capa de Lógica de Negocio):** Una API RESTful construida con Node.js y Express. Se encarga de procesar la lógica de negocio, validaciones del servidor, cálculo de estadísticas y de actuar como puente seguro entre la base de datos y la interfaz gráfica.
3.  **Base de Datos (Capa de Datos):** Un sistema de gestión de bases de datos relacional (RDBMS) utilizando PostgreSQL. Toda la información persiste aquí y mantiene la integridad referencial del modelo de negocio.

## 3. Tecnologías y Servicios Empleados

*   **Frontend:** React, React Router Dom (navegación), CSS nativo (para estilización estructurada y modular).
*   **Backend:** Node.js, Express, `pg` (cliente de PostgreSQL para Node), `dotenv` (para gestión de variables de entorno), `cors` (para permitir la comunicación entre el frontend y backend).
*   **Contenedorización (Docker):** Utilizado para levantar el motor de base de datos PostgreSQL, asegurando que el entorno de desarrollo, pruebas y producción sea estandarizado, evitando el problema de "en mi máquina sí funciona".

---

## 4. Base de Datos en Docker (PostgreSQL)
Se eligió **Docker** para desplegar la base de datos **PostgreSQL**. Esta decisión técnica garantiza la portabilidad del proyecto.

*   **¿Cómo funciona?** El motor de la base de datos corre de forma aislada en un contenedor dentro del equipo host. El backend se conecta a ella a través de un puerto expuesto (típicamente el 5432).
*   **Conexión (`db.js`):** El backend utiliza un `Pool` de conexiones de la librería `pg`. Al usar un *Pool*, Node.js administra eficientemente múltiples conexiones concurrentes sin abrir y cerrar la conexión en cada petición. Las credenciales se toman de forma segura a través de variables de entorno (`DB_USER`, `DB_HOST`, `DB_NAME`, etc.).
*   **Tablas identificadas en el flujo:**
    *   `Empleado` y `Credencial`: Para la autenticación.
    *   `Sesion`: Para registrar la auditoría y control de accesos.
    *   `Rol_user` y `Empleado_Rol`: Para la gestión de privilegios y permisos (ej. Admin vs Cajero).
    *   `Producto` e `Inventario`: Para el catálogo y existencias.
    *   `Proveedor`: Para gestionar a los surtidores de insumos.
    *   `Venta` y `Detalle_venta`: Almacenan el histórico general de ingresos y los productos específicos vendidos en cada transacción.
    *   `Cancelar_venta`: Registra las justificaciones de anulaciones (borrado lógico), manteniendo el historial intacto para auditorías.
    *   `Corte_caja`: Registra aperturas, flujos y cierres de dinero por turnos.

---

## 5. Estructura de Directorios (Módulos y Componentes)

### 5.1 Backend
*   **`backend/server.js`:** Es el archivo de entrada. Configura los middlewares (`cors`, `express.json`), define las rutas de la API REST y arranca el servidor HTTP en el puerto especificado.
*   **`backend/db.js`:** Encapsula y exporta el módulo responsable de la conexión a la base de datos.

### 5.2 Frontend (`fotoideas-app/src/`)
*   **`components/`**: Alberga las piezas reutilizables de la UI.
    *   `ventas/`: Componentes específicos del módulo de ventas (`ScannerInput`, `SaleTable`, `SaleSummary`, `CorteCaja`, `CobrarModal`).
    *   `ui/`: Componentes base (botones, inputs, modales, tablas).
    *   `layout/`: Componentes estructurales (como el `Sidebar` para la navegación).
*   **`pages/`**: Vistas principales o "páginas" del enrutador, por ejemplo `Login.jsx`.
*   **`services/`**: Archivos que aíslan la lógica de llamadas HTTP hacia la API. Ejemplos: `productService.js` y `ventaService.js`.
*   **`styles/` y Archivos CSS locales:** Manejo de la apariencia visual del sistema usando flexbox y CSS Grid para asegurar la adaptabilidad (Responsive Design).

---

## 6. Dinámica y Flujo de Trabajo (Workflows)

### 6.1 Flujo de Autenticación (Login)
1.  El usuario ingresa credenciales en el Frontend (`Login.jsx`).
2.  React captura los datos mediante estados (`useState`) y envía una petición POST a `/api/login`.
3.  El Backend (`server.js`) busca coincidencia exacta y que el usuario esté activo (`estado_credencial = TRUE`).
4.  Si es correcto, inserta un log automático en la tabla `Sesion` (Auditoría).
5.  El Backend responde con éxito y envía los datos del usuario.
6.  React almacena `auth=true` y el objeto `user` en el `localStorage` del navegador, para luego redirigir al `/dashboard`.

### 6.2 Flujo del Punto de Venta (POS)
1.  **Escaneo:** El usuario utiliza `ScannerInput.jsx` para ingresar o escanear un código de barras. Al dar "Enter", invoca a `onAdd(codigo)`.
2.  **Búsqueda:** El controlador de la vista (o el frontend) llama a `productService.js` (`getProductoPorCodigo()`). Este hace un GET a la API `/api/productos/codigo/:codigo`.
3.  **Listado:** Si la API devuelve un producto existente, se añade a la lista de `SaleTable.jsx`, donde se calcula el subtotal iterativo.
4.  **Resumen:** `SaleSummary.jsx` muestra el Total. Si el rol no es "Admin", el botón de "Cancelar Venta" se deshabilita para evitar fraudes.
5.  **Cobro:** Al hacer clic en "Cobrar", se abre el `CobrarModal` para recibir el pago, registrar el cambio y confirmar la operación en el sistema.

### 6.3 Flujo de Corte de Caja
1.  **Apertura Automática:** Al solicitar `/api/corte/datos`, el sistema verifica si el empleado tiene un turno activo. Si no lo tiene, crea automáticamente uno nuevo en ceros para iniciar el turno.
2.  **Suma de Ventas:** La base de datos agrupa y suma las ventas vinculadas específicamente al `id_corte_caja` del turno activo en ese momento, separando los flujos monetarios.
3.  **Cierre:** El Frontend presenta un formulario (`CorteCaja`) donde el empleado captura cuánto dinero físico tiene (efectivo real).
4.  **Conclusión:** Al guardar (`POST /api/corte/realizar`), el servidor actualiza el registro con el `efectivo_real` y la `diferencia_caja`. Al registrarse el efectivo, el turno queda oficialmente cerrado.

### 6.4 Flujo de Cancelación de Venta
1.  El usuario (con los permisos de administrador adecuados) selecciona una venta previamente completada desde un historial.
2.  El Frontend invoca el servicio `cancelarVentaRealizada` (`ventaService.js`), enviando el ID de la venta seleccionada.
3.  Se realiza una petición HTTP `DELETE` hacia `/api/ventas/:id`.
4.  El Backend realiza un **borrado lógico**, conservando los datos en la tabla `Venta` y `Detalle_venta`, pero insertando un registro vinculado en la tabla `Cancelar_venta`. Esto permite mantener el historial intacto para auditorías.

---

## 7. Diccionario de Endpoints (Backend - `server.js`)

| Método | Endpoint | Descripción y Comportamiento |
| :--- | :--- | :--- |
| **GET** | `/` | Endpoint de validación (Health Check) para confirmar que la API de Express responde. |
| **POST** | `/api/login` | Autenticación y registro de auditoría en la tabla `Sesion`. |
| **GET** | `/api/productos` | Retorna lista de productos con su stock actual (JOIN con `Inventario`) y su estado. |
| **POST** | `/api/productos` | Registra un nuevo producto en la tabla `Producto` y su stock inicial en `Inventario`. |
| **PUT** | `/api/productos/:id`| Actualiza la información de un producto existente y ajusta su stock. |
| **DELETE**| `/api/productos/:id`| Realiza un **borrado lógico** de un producto (cambia estado a inactivo y stock a 0). |
| **GET** | `/api/productos/codigo/:codigo` | Consulta por `codigo_barras_producto`. Si no existe retorna error 404, de lo contrario devuelve ID, nombre y precio. |
| **GET** | `/api/proveedores` | Retorna el catálogo de todos los proveedores registrados. |
| **POST** | `/api/proveedores` | Crea un nuevo registro de proveedor en la tabla `Proveedor`. |
| **PUT** | `/api/proveedores/:id` | Actualiza la información de contacto y empresa de un proveedor. |
| **DELETE** | `/api/proveedores/:id` | Elimina un proveedor físicamente (solo si no existen operaciones vinculadas en otras tablas). |
| **GET** | `/api/dashboard/stats` | Reúne métricas globales para las tarjetas del Dashboard (Ventas, Inventario, Proveedores y Alertas). |
| **GET** | `/api/corte/datos` | Busca el último corte de caja "activo". Si no existe, genera la apertura de un nuevo turno automáticamente. Suma las transacciones específicas de dicho turno. |
| **POST** | `/api/corte/realizar` | Recibe la contabilidad física, actualiza la tabla `Corte_caja` calculando variaciones (`diferencia_caja`) y marca la hora de cierre final. |
| **DELETE**| `/api/ventas/:id` | Permite cancelar una venta ya completada mediante borrado lógico, registrándola en la tabla `Cancelar_venta` sin eliminar físicamente el historial. |

---

## 8. Explicación de Componentes Frontend

*   **`Login.jsx`:** Vista principal de acceso. Utiliza componentes genéricos como `Input` y `Button`. Maneja los errores devolviendo retroalimentación visual al usuario en caso de fallas de conexión o credenciales.
*   **`ScannerInput.jsx`:** Un input altamente especializado. Tiene `autoFocus` (ideal para pistolas de código de barras) y un *Event Listener* para detectar la tecla `Enter`, evitando la necesidad de hacer clic en un botón de buscar.
*   **`SaleTable.jsx`:** Componente de renderizado de la grilla de ventas. Contiene funciones de seguridad como `formatearPrecio` y `obtenerCantidad` para prevenir que `NaN` o valores nulos colapsen la vista si llegan datos malformados de la API.
*   **`SaleSummary.jsx`:** Orquesta la conclusión de la venta. Se encarga de hacer el sumatorio o `reduce` matemático, y maneja la apertura de Modales (ventanas emergentes) tanto para el Cobro como para cancelar la venta actual.
*   **`Inventario.jsx`:** Vista principal del módulo de inventario. Administra el estado global para alternar entre "Gestionar" y "Consultar", y centraliza las llamadas a la API (CRUD).
*   **`InventoryForm.jsx`:** Formulario dinámico que adapta sus campos dependiendo si la acción es "Agregar", "Actualizar" o "Borrar". Construido como un componente controlado para evitar advertencias de React.
*   **`InventoryTable.jsx`:** Grilla para visualizar el catálogo completo. Incluye indicadores visuales (badges) para alertar sobre stock bajo y el estado (Activo/Inactivo) del producto.
*   **`productService.js`:** Es una "Capa de Abstracción" vital. En vez de llamar a `fetch` desperdigado por los componentes React, el código está aquí. Realiza 6 pasos estrictos (desde invocar a la API hasta asegurar que la estructura JSON de respuesta tenga sentido antes de enviar datos al componente de UI).
*   **`ventaService.js`:** Capa de abstracción para gestionar las operaciones sobre el histórico de las ventas, como la anulación/cancelación de transacciones ya procesadas.
*   **`Proveedores.jsx`:** Vista principal del módulo de proveedores, maneja la conexión con el backend para la administración del catálogo de proveedores.
*   **`ProviderForm.jsx` / `ProviderTable.jsx`:** Componentes modulares y reutilizables para separar el formulario de captura y la grilla de visualización del listado de proveedores.

---

## 9. Conclusión y Recomendaciones de Mantenimiento

El sistema está estructurado con buenas prácticas contemporáneas de modularidad y separación de responsabilidades:
1.  **Seguridad:** Tienes validaciones de roles incrustadas (como bloquear el botón "Cancelar" dependiendo del rol) y consultas paramétricas en PostgreSQL (`$1, $2...`) que te protegen muy bien contra ataques de **Inyección SQL**.
2.  **Modularidad:** Usas componentes UI base reutilizables.
3.  **Variables de Entorno:** Tu uso de `.env` en el backend hace que el sistema sea seguro para alojarse en repositorios públicos sin filtrar contraseñas de la base de datos.

**Posibles Mejoras Futuras:**
*   Se recomienda añadir JSON Web Tokens (JWT) en el Login, en vez de devolver `success: true`, para poder proteger los Endpoints de ventas e inventario.
*   Considerar mover el "Cajero logueado (`id_empleado = 1`)" fijo en `/api/corte/datos` para que dinámicamente obtenga el ID de quien hizo la solicitud HTTP mediante el token sugerido en el punto anterior.

---

## 10. Correcciones Inmediatas y Deuda Técnica (Roadmap)

Para completar la funcionalidad integral del sistema POS, están pendientes de desarrollar e integrar los siguientes módulos y tareas técnicas:

*   **Página de Inventario:** **(Completado)** Desarrollo de la interfaz gráfica (CRUD) para visualizar, agregar, actualizar y eliminar de forma lógica los productos.
*   **Página de Proveedores:** **(Completado)** Integración de la vista completa (CRUD) con su respectiva tabla y formularios modulares conectados al backend.
*   **Página de Usuarios (Empleados):** **(Completado)** Implementación de una vista administrativa protegida por roles exclusivos para perfiles autorizados, que permite dar de alta nuevos empleados y gestionar sus credenciales.
*   **Página de Reportes:** Módulo analítico donde se podrán consultar historiales detallados de ventas por rangos de fechas, revisar la auditoría de los cortes de caja y visualizar de manera profunda las métricas clave mostradas en el Dashboard.
*   **Integración de Pistola Escáner:** **(Completado)** Creación del componente `ScannerInput.jsx` que intercepta los disparos del lector de código de barras físico sin depender de clics ni botones.
    ~~**Agregar otra tabla para las bajas (cancelar venta)**~~ **(Completado)**