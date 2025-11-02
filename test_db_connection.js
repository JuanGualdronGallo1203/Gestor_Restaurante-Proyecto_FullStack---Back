// test_db_connection.js

require('dotenv').config(); // Lee el .env (¡Importante!)
const { MongoClient } = require('mongodb');

// Lee las mismas variables que usa tu app
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  console.error('Error: MONGO_URI o DB_NAME no están en el .env');
  process.exit(1);
}

console.log(`[TEST] Conectando a: ${uri}`);
console.log(`[TEST] Buscando base de datos: ${dbName}`);

const client = new MongoClient(uri);

async function runTest() {
  try {
    // 1. Conectar al cluster
    await client.connect();
    console.log('[TEST] ¡Conexión al cluster exitosa!');

    // 2. Apuntar a la base de datos
    const db = client.db(dbName);
    console.log(`[TEST] Apuntando a la base de datos: ${db.databaseName}`);

    // 3. Listar todas las colecciones en esta DB
    const collections = await db.listCollections().toArray();
    console.log('\n--- Colecciones Encontradas ---');
    if (collections.length === 0) {
      console.log('No se encontraron colecciones. (Asegúrate de haber registrado al menos un usuario).');
    } else {
      collections.forEach(col => console.log(`- ${col.name}`));
    }

    // 4. Intentar encontrar la colección 'users'
    const usersCollection = db.collection('users');
    if (usersCollection) {
      console.log('\n--- Documentos en la colección "users" ---');
      
      // 5. Encontrar y mostrar todos los usuarios
      const users = await usersCollection.find({}).toArray();
      
      if (users.length === 0) {
        console.log('La colección "users" existe pero está vacía.');
      } else {
        console.log('¡¡¡DATOS ENCONTRADOS!!!');
        // Imprime los usuarios que encontró
        console.log(JSON.stringify(users, null, 2));
      }
    }

  } catch (err) {
    console.error('\n--- ERROR EN LA CONEXIÓN ---');
    console.error(err);
  } finally {
    // 6. Cerrar la conexión
    await client.close();
    console.log('\n[TEST] Conexión cerrada.');
  }
}

// Ejecutar el script
runTest();