# Proyecto: API de Reseñas de Restaurantes (Backend)

Este repositorio contiene el backend de una aplicación full-stack para calificar y rankear restaurantes y platos. La API está construida con **Node.js**, **Express**, y **MongoDB** (usando el driver nativo), siguiendo principios de diseño SOLID y una arquitectura limpia.

## El Objetivo del Proyecto

El objetivo es desarrollar una API robusta, segura y escalable que sirva como el cerebro de un sistema de reseñas. Debe gestionar usuarios con diferentes roles (Usuario y Administrador), manejar la autenticación mediante JWT, y realizar operaciones complejas de base de datos, como **transacciones atómicas** para la creación de reseñas y la gestión de "likes", asegurando la integridad de los datos.

---

## 🚀 Tecnologías y Dependencias

Esta API utiliza un conjunto de herramientas modernas y robustas para garantizar la seguridad, eficiencia y mantenibilidad:

| Dependencia | Propósito |
| :--- | :--- |
| **Express** | Framework web minimalista para crear el servidor, gestionar rutas y middlewares. |
| **MongoDB (Driver Nativo)**| Para la comunicación directa con la base de datos NoSQL. Se eligió sobre Mongoose para manejar lógica de bajo nivel y transacciones manualmente. |
| **`bcrypt`** | Para encriptar (hashear) de forma segura las contraseñas de los usuarios antes de guardarlas en la base de datos. |
| **`jsonwebtoken` (`jwt`)** | Para crear y verificar JSON Web Tokens, el estándar usado para la autenticación y el manejo de sesiones. |
| **`passport` y `passport-jwt`** | Middlewares para la autenticación. Se usan para proteger rutas y verificar que un usuario (o un admin) esté logueado. |
| **`dotenv`** | Para cargar variables de entorno (como llaves de API, secretos de JWT y la URI de la DB) desde un archivo `.env` al proceso. |
| **`express-validator`** | Un conjunto de middlewares para validar los datos que llegan en el `body` de las peticiones (ej. asegurar que un email es válido). |
| **`express-rate-limit`** | Middleware para limitar la cantidad de peticiones a la API desde una misma IP, previniendo ataques de fuerza bruta. |
| **`cors`** | Para habilitar el Cross-Origin Resource Sharing, permitiendo que el frontend (que vive en otro dominio/repositorio) pueda hacer peticiones a esta API. |
| **`nodemon`** (Desarrollo) | Herramienta de desarrollo que reinicia automáticamente el servidor cada vez que detecta un cambio en los archivos. |

---

## 🏛️ Arquitectura de la API

El proyecto sigue una arquitectura limpia y modular, inspirada en los principios **SOLID**, para separar responsabilidades y facilitar el mantenimiento.

El flujo de una petición es el siguiente:

1.  **`/routes` (Rutas)**
    * Define los *endpoints* (ej. `POST /api/v1/auth/login`).
    * Valida la entrada usando `express-validator`.
    * Aplica middlewares de seguridad (`isAuthenticated`, `isAdmin`).
    * Llama al `Controlador` correspondiente.

2.  **`/controllers` (Controladores)**
    * **Propósito:** Orquestar la petición. Es el único que interactúa con `req` (petición) y `res` (respuesta).
    * Extrae datos del `body` o `params`.
    * Llama al `Servicio` para ejecutar la lógica.
    * Devuelve la respuesta al cliente (ej. `res.status(200).json(...)`).

3.  **`/services` (Servicios)**
    * **Propósito:** Contiene la **lógica de negocio pura**.
    * *No sabe* sobre `req` o `res`.
    * Coordina operaciones, valida reglas de negocio (ej. "un usuario no puede dar like a su propia reseña") e inicia transacciones.
    * Llama al `Repositorio` para obtener o guardar datos.

4.  **`/repositories` (Repositorios)**
    * **Propósito:** Es la **única capa que habla con la base de datos**.
    * Abstrae toda la lógica de MongoDB (ej. `db.collection('users').findOne(...)`).
    * Acepta sesiones de transacción para operaciones atómicas.

Este diseño (Ruta -> Controlador -> Servicio -> Repositorio) hace que el código sea fácil de probar (testing), de escalar y de mantener.

---

## 🛠️ Funcionamiento y Características

* **Autenticación y Seguridad:** Sistema completo de registro (`/register`) y login (`/login`) con `bcrypt` y `JWT`.
* **Roles de Usuario:** Diferenciación clara entre `usuario` y `administrador`.
* **Middlewares de Protección:** Rutas protegidas usando `isAuthenticated` (para usuarios logueados) e `isAdmin` (solo para administradores).
* **Gestión de Administrador:** Los administradores pueden gestionar `Categorías`, `Platos`, y aprobar nuevos `Restaurantes`.
* **Flujo de Aprobación:** Los usuarios pueden crear restaurantes, pero estos se guardan con estado `"pendiente"` hasta que un administrador los aprueba (`PATCH /restaurants/:id/approve`).
* **Transacciones Atómicas:** El backend utiliza **transacciones de MongoDB** para operaciones críticas (crear/borrar reseñas, dar likes/dislikes) para garantizar que múltiples operaciones en la base de datos fallen o tengan éxito juntas, evitando datos corruptos.
* **CRUDs Anidados:**
    * Gestión de `Platos` (vinculados a Restaurantes).
    * Gestión de `Reseñas` (vinculadas a Restaurantes).
* **Sistema de Votación:** Los usuarios pueden dar `like` y `dislike` a las reseñas de otros, afectando el futuro ranking del restaurante.

---

## 🔌 Instalación y Puesta en Marcha

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-repositorio-backend.git](https://github.com/tu-usuario/tu-repositorio-backend.git)
    cd tu-repositorio-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Crear archivo `.env`:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno:

    ```env
    # Puerto del servidor
    PORT=3001
    
    # URL de conexión de MongoDB Atlas
    MONGO_URI=mongodb+srv://<tu-usuario>:<tu-password>@<tu-cluster-url>/<tu-db-name>?retryWrites=true&w=majority
    
    # Secreto para firmar los JWT (usa una frase larga y aleatoria)
    JWT_SECRET=TU_FRASE_SECRETA_PARA_JWT
    ```

4.  **Ejecutar el servidor (modo desarrollo):**
    ```bash
    npm run dev
    ```

El servidor estará corriendo en `http://localhost:3001`.

---

## 🗺️ Endpoints Principales de la API

* `POST /api/v1/auth/register` - Registro de nuevo usuario.
* `POST /api/v1/auth/login` - Login de usuario, devuelve un JWT.

* `POST /api/v1/categories` - [Admin] Crea una categoría.
* `GET /api/v1/categories` - [Admin] Obtiene todas las categorías.

* `POST /api/v1/restaurants` - [Usuario] Crea un restaurante (queda pendiente).
* `GET /api/v1/restaurants` - [Público] Obtiene todos los restaurantes **aprobados**.
* `GET /api/v1/restaurants/:id` - [Público] Obtiene un restaurante **aprobado**.
* `PATCH /api/v1/restaurants/:id/approve` - [Admin] Aprueba un restaurante.
* `DELETE /api/v1/restaurants/:id` - [Admin] Elimina un restaurante.

* `POST /api/v1/restaurants/:restaurantId/dishes` - [Admin] Añade un plato a un restaurante.
* `GET /api/v1/restaurants/:restaurantId/dishes` - [Público] Obtiene los platos de un restaurante.
* `DELETE /api/v1/dishes/:id` - [Admin] Elimina un plato.

* `POST /api/v1/restaurants/:restaurantId/reviews` - [Usuario] Crea una reseña.
* `GET /api/v1/restaurants/:restaurantId/reviews` - [Público] Obtiene las reseñas de un restaurante.
* `DELETE /api/v1/reviews/:id` - [Usuario] Elimina su propia reseña.
* `POST /api/v1/reviews/:id/like` - [Usuario] Da "like" a una reseña.
* `POST /api/v1/reviews/:id/dislike` - [Usuario] Da "dislike" a una reseña.