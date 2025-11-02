const { MongoClient } = require('mongodb');
require('dotenv').config(); // Asegura que las variables de entorno estén cargadas

// Lee la URL de conexión (sin el nombre de la DB)
const uri = process.env.MONGO_URI; "mongodb+srv://Usuario1:Comida1@cluster0.odhyosi.mongodb.net/?appName=Cluster0"
// Lee el nombre de la base de datos
const dbName = process.env.DB_NAME; "Usuario1"

// Validación
if (!uri) {
  throw new Error('La variable MONGO_URI no está definida en el archivo .env');
}
if (!dbName) {
  throw new Error('La variable DB_NAME no está definida en el archivo .env');
}

// --- ¡LÍNEA DE PRUEBA 1! ---
// Esto imprimirá en tu terminal el nombre de la DB que está leyendo del .env
console.log(`[DB Config] Intentando conectar a la base de datos: ${dbName}`);
// ---------------------------------

// Crea el cliente usando la URL
const client = new MongoClient(uri);

// Esta variable almacenará la instancia de la base de datos
let dbInstance;

/**
 * Conecta a la base de datos de MongoDB.
 */
async function connectToDb() {
  try {
    await client.connect();
    console.log('[DB] Conectado a MongoDB.');

    // Aquí le decimos explícitamente qué base de datos usar
    dbInstance = client.db(dbName);

    // --- ¡LÍNEA DE PRUEBA 2! ---
    // Esto confirmará a qué base de datos se conectó realmente
    console.log(`[DB] Conexión exitosa a la base de datos: ${dbInstance.databaseName}`);
    // ---------------------------------

  } catch (err) {
    console.error('Error al conectar con MongoDB:', err);
    process.exit(1); // Termina la aplicación si no se puede conectar
  }
}

/**
 * Devuelve la instancia de la base de datos (db).
 */
function getDb() {
  if (!dbInstance) {
    throw new Error('Debes conectar a la base de datos primero (llama a connectToDb)');
  }
  return dbInstance;
}

/**
 * Devuelve la instancia del cliente de MongoDB.
 * (Necesario para las transacciones)
 */
function getClient() {
  if (!client) {
    throw new Error('Cliente de MongoDB no inicializado.');
  }
  return client;
}

module.exports = { connectToDb, getDb, getClient };