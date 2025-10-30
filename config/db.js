const { MongoClient } = require('mongodb');
require('dotenv').config(); 

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('La variable MONGO_URI no está definida en el archivo .env');
}

const client = new MongoClient(uri); 
// Esta variable almacenará la instancia de la base de datos
let dbInstance;

/**
 * Conecta a la base de datos de MongoDB.
 * Esta función debe llamarse al iniciar la aplicación (en menu.js).
 */
async function connectToDb() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB.');
    
    dbInstance = client.db(); // Si tu URI ya incluye la DB, esto es suficiente.
    
    
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err);
    process.exit(1); // Termina la aplicación si no se puede conectar
  }
}

/**
 * Devuelve la instancia de la base de datos (db).
 * Permite que otras partes de la app interactúen con la DB.
 * @returns {Db} Instancia de la base de datos de MongoDB
 */
function getDb() {
  if (!dbInstance) {
    throw new Error('Debes conectar a la base de datos primero (llama a connectToDb)');
  }
  return dbInstance;
}
/**
 * Devuelve la instancia del cliente de MongoDB.
 * Necesario para iniciar sesiones y transacciones.
 * @returns {MongoClient}
 */
function getClient() {
  if (!client) {
    throw new Error('Cliente de MongoDB no inicializado.');
  }
  return client;
}
module.exports = { connectToDb, getDb };