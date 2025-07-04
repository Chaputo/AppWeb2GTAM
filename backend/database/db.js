import mongoose from "mongoose";

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/appweb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión', err));


// Definición del esquema para el modelo de usuario
const usuarioSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});
module.exports = mongoose.model('Usuario', usuarioSchema);


// Ejemplo de uso para crear un nuevo usuario
const Usuario = require('./models/Usuario');
const nuevoUsuario = new Usuario({ username, password: hashedPassword });
await nuevoUsuario.save();