// models/User.js

const mongoose = require('mongoose');

// 📌 Definimos el esquema del modelo User
const UserSchema = new mongoose.Schema({
  // Nombre de usuario único, sin espacios, obligatorio
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true
  },

  // Correo electrónico único, obligatorio y convertido a minúsculas
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true
  },

  // Contraseña del usuario, requerida (se almacenará hasheada en el futuro)
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },

  // Fecha de creación del usuario (por defecto: ahora)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 📌 Creamos el modelo 'User' basado en el esquema y lo exportamos
module.exports = mongoose.model('User', UserSchema);