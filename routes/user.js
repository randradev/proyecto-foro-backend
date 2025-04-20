const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken'); // Importamos el middleware

// 📌 Obtener todos los usuarios (requiere estar autenticado)
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Excluir contraseña
    res.json(users);
  } catch (error) {
    console.error('[Error al obtener usuarios]:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// 📌 Obtener un usuario por ID (requiere estar autenticado)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('[Error al obtener usuario]:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// 📌 Actualizar un usuario (requiere estar autenticado)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado', user: updatedUser });
  } catch (error) {
    console.error('[Error al actualizar usuario]:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// 📌 Eliminar un usuario (requiere estar autenticado)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('[Error al eliminar usuario]:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;