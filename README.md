# Proyecto: API de Reseñas de Restaurantes (Backend)

Este repositorio contiene el backend de una aplicación full-stack para calificar y rankear restaurantes y platos. La API está construida con **Node.js**, **Express**, y **MongoDB** (usando el driver nativo), siguiendo principios de diseño SOLID y una arquitectura limpia.

## El Objetivo del Proyecto

El objetivo es desarrollar una API robusta y segura que sirva como el cerebro de un sistema de reseñas. Debe gestionar usuarios con diferentes roles (Usuario y Administrador) y manejar la autenticación mediante JWT.

El flujo de permisos es estricto:
* **Administrador:** Tiene control total (CRUD) sobre **Restaurantes**, **Categorías** y **Platillos**. También puede eliminar *cualquier* reseña.
* **Usuario:** Puede **ver** Restaurantes y Platillos. Tiene control total (CRUD) *únicamente de sus propias* reseñas, tanto de restaurantes como de platillos.

---

## 🚀 Tecnologías y Dependencias

Esta API utiliza un conjunto de herramientas modernas y robustas para garantizar la seguridad, eficiencia y mantenibilidad:

| Dependencia | Propósito |
| :--- | :--- |
| **Express** | Framework web minimalista para crear el servidor, gestionar rutas y middlewares. |
| **MongoDB (Driver Nativo)**| Para la comunicación directa con la base de datos NoSQL. Se eligió sobre Mongoose para manejar lógica de bajo nivel. |
| **`bcrypt`** | Para encriptar (hashear) de forma segura las contraseñas de los usuarios. |
| **`jsonwebtoken` (`jwt`)** | Para crear y verificar JSON Web Tokens, el estándar usado para la autenticación. |
| **`passport` y `passport-jwt`** | Middlewares para la autenticación. Se usan para proteger rutas y verificar la identidad del usuario y su rol. |
| **`dotenv`** | Para cargar variables de entorno (como la URI de la DB y el secreto de JWT) desde un archivo `.env`. |
| **`express-validator`** | Middlewares para validar los datos que llegan en el `body` de las peticiones. |
| **`express-rate-limit`** | Middleware para limitar la cantidad de peticiones a la API desde una misma IP, previniendo ataques de fuerza bruta. |
| **`cors`** | Para habilitar el Cross-Origin Resource Sharing, permitiendo que el frontend (en otro repositorio) pueda hacer peticiones a esta API. |
| **`nodemon`** (Desarrollo) | Herramienta de desarrollo que reinicia automáticamente el servidor cada vez que detecta un cambio en los archivos. |

---

## 🏛️ Arquitectura de la API

El proyecto sigue una arquitectura limpia y modular (Ruta -> Controlador -> Servicio -> Repositorio) inspirada en los principios **SOLID** para separar responsabilidades:

1.  **`/routes` (Rutas):** Define los *endpoints* (ej. `POST /api/v1/auth/login`), aplica validaciones (`express-validator`) y middlewares de seguridad (`isAuthenticated`, `isAdmin`).
2.  **`/controllers` (Controladores):** Orquesta la petición. Es el único que interactúa con `req` y `res`. Llama al `Servicio` y devuelve la respuesta al cliente.
3.  **`/services` (Servicios):** Contiene la **lógica de negocio pura**. Valida reglas (ej. "el usuario solo puede borrar su propia reseña") y llama al `Repositorio`.
4.  **`/repositories` (Repositorios):** Es la **única capa que habla con la base de datos** (ej. `db.collection('users').findOne(...)`).

---

## 🛠️ Funcionamiento y Características

* **Autenticación y Seguridad:** Sistema completo de registro (`/register`) y login (`/login`) con `bcrypt` y `JWT`.
* **Roles Estrictos:**
    * **Admin:** Gestiona Restaurantes, Platillos y Categorías.
    * **Usuario:** Consume datos y gestiona *sus propias* reseñas.
* **Gestión de Administrador:** El Admin tiene CRUD completo sobre `Restaurantes`, `Categorías` y `Platos`.
* **Gestión de Reseñas por Propietario:**
    * Los usuarios tienen CRUD (Crear, Leer, Actualizar, Eliminar) sobre las reseñas que ellos mismos crearon.
    * Un `Admin` puede borrar la reseña de cualquier usuario.
* **Dos Tipos de Reseñas:** El sistema maneja dos colecciones de reseñas independientes:
    1.  Reseñas vinculadas a **Restaurantes**.
    2.  Reseñas vinculadas a **Platillos**.
* **CRUDs Anidados:** La API maneja rutas anidadas de forma lógica (ej. `GET /restaurants/:restaurantId/reviews`).

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

## 🗺️ Endpoints Principales de la API (Actualizados)

### Autenticación (Auth)
* `POST /api/v1/auth/register` - **[Público]** Registra un nuevo usuario.
* `POST /api/v1/auth/login` - **[Público]** Inicia sesión y devuelve un JWT.

### Categorías (Categories)
* `POST /api/v1/categories` - **[Admin]** Crea una nueva categoría.
* `GET /api/v1/categories` - **[Admin]** Obtiene todas las categorías.
* `PUT /api/v1/categories/:id` - **[Admin]** Actualiza una categoría.
* `DELETE /api/v1/categories/:id` - **[Admin]** Elimina una categoría.

### Restaurantes (Restaurants)
* `POST /api/v1/restaurants` - **[Admin]** Crea un restaurante.
* `GET /api/v1/restaurants` - **[Usuario]** Obtiene la lista de restaurantes.
* `GET /api/v1/restaurants/:id` - **[Usuario]** Obtiene un restaurante por ID.
* `PUT /api/v1/restaurants/:id` - **[Admin]** Actualiza un restaurante.
* `DELETE /api/v1/restaurants/:id` - **[Admin]** Elimina un restaurante.

### Platos (Dishes)
* `POST /api/v1/restaurants/:restaurantId/dishes` - **[Admin]** Añade un plato a un restaurante.
* `GET /api/v1/restaurants/:restaurantId/dishes` - **[Usuario]** Obtiene los platos de un restaurante.
* `PUT /api/v1/dishes/:id` - **[Admin]** Actualiza un plato (por su ID).
* `DELETE /api/v1/dishes/:id` - **[Admin]** Elimina un plato (por su ID).

### Reseñas de Restaurante (Restaurant Reviews)
* `POST /api/v1/restaurants/:restaurantId/reviews` - **[Usuario]** Publica una reseña de un restaurante.
* `GET /api/v1/restaurants/:restaurantId/reviews` - **[Usuario]** Obtiene las reseñas de un restaurante.
* `PUT /api/v1/reviews/:id` - **[Usuario (Dueño)]** Actualiza su propia reseña de restaurante.
* `DELETE /api/v1/reviews/:id` - **[Usuario (Dueño) o Admin]** Elimina una reseña de restaurante.

### Reseñas de Platillo (Dish Reviews)
* `POST /api/v1/dishes/:dishId/reviews` - **[Usuario]** Publica una reseña de un platillo.
* `GET /api/v1/dishes/:dishId/reviews` - **[Usuario]** Obtiene las reseñas de un platillo.
* `PUT /api/v1/dish-reviews/:id` - **[Usuario (Dueño)]** Actualiza su propia reseña de platillo.
* `DELETE /api/v1/dish-reviews/:id` - **[Usuario (Dueño) o Admin]** Elimina una reseña de platillo.