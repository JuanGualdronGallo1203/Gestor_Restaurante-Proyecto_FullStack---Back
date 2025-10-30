// Carga las variables de entorno del .env
require('dotenv').config();

const app = require('./app'); // Importa la app de Express
const { connectToDb } = require('./config/db'); // Importa la conexión a la DB

const PORT = process.env.PORT || 3000;

/**
 * Función principal para iniciar el servidor.
 * Primero conecta la DB, luego levanta el servidor de Express.
 */
async function startServer() {
  try {
    // 1. Conectar a la base de datos
    await connectToDb();
    console.log('Conexión a MongoDB exitosa.');

    // 2. Iniciar el servidor de Express
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1); // Cierra la aplicación si la DB no se pudo conectar
  }
}

// Llama a la función para arrancar todo
startServer();