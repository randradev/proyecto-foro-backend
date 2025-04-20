// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // importamos el modelo
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// 📌 Ruta POST /register - Registra un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Comprobar si el usuario o email ya existen
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario o correo ya están registrados' });
    }

    // Crear y guardar el usuario con contrasela encriptada
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword, // ← Ahora sí encriptada
      });

    await newUser.save(); // Guardar en la base de datos

    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('[Error en registro]:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 📌 Ruta POST /login - Inicia sesión un usuario existente
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validar campos
      if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
      }
  
      // Buscar el usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas (email)' });
      }
  
      // 🔐 Comparar contraseñas cifradas
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas (contraseña)' });
      }
  
      // Crear el JWT (utilizando el ID del usuario y el nombre de usuario)
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,  // Clave secreta para firmar el token
        { expiresIn: '1h' }     // Expiración del token (1 hora en este caso)
      );

      // Enviar el token al cliente
      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        token, // El token se devuelve al cliente
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });

    } catch (error) {
      console.error('[Error en login]:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

module.exports = router;