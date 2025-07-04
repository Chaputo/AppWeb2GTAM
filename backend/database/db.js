import { MongoClient } from "mongodb";

const uri = "mongodb+srv://LucasAcosta:123MDBLucas@gtam.37wlekf.mongodb.net/?retryWrites=true&w=majority&appName=GTAM";
const client = new MongoClient(uri);

// Conectar a la base de datos
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB Atlas con MongoClient');
    return client.db();
  } catch (error) {
    console.error('Error de conexión a MongoDB Atlas:', error);
    throw error;
  }
}

// Cerrar la conexión
async function closeDatabaseConnection() {
  await client.close();
  console.log('Conexión a MongoDB Atlas cerrada.');
}

// Exportar el cliente y las funciones de conexión
export { connectToDatabase, closeDatabaseConnection, client };