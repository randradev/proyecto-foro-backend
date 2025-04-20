const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verifyToken = require('../middleware/verifyToken'); // Importamos el middleware

// 📌 Obtener todas las publicaciones (requiere estar autenticado)
router.get('/', verifyToken, async (req, res) => {
    try {
      const posts = await Post.find().populate('author', 'username email'); // Aquí populizamos el autor
      return res.status(200).json(posts);
    } catch (error) {
      console.error('[Error al obtener publicaciones]:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// 📌 Crear una publicación (requiere estar autenticado)
router.post('/', verifyToken, async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.userId; // Obtenemos el userId del token

      if (!title || !content) {
        return res.status(400).json({ message: 'El título y el contenido son obligatorios' });
      }

      const newPost = new Post({
        title,
        content,
        author: userId  // Relacionamos el post con el autor
      });

      await newPost.save();
      return res.status(201).json({ message: 'Publicación creada exitosamente', post: newPost });
    } catch (error) {
      console.error('[Error al crear publicación]:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// 📌 Eliminar publicación (requiere estar autenticado)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.userId; // Obtenemos el userId del token

      // Buscar la publicación por ID
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Publicación no encontrada' });
      }

      // Verificar que el usuario que intenta eliminarla sea el autor
      if (post.author.toString() !== userId) {
        return res.status(403).json({ message: 'No tienes permisos para eliminar esta publicación' });
      }

      // Eliminar la publicación
      await Post.findByIdAndDelete(postId);
      return res.status(200).json({ message: 'Publicación eliminada exitosamente' });
    } catch (error) {
      console.error('[Error al eliminar publicación]:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// 📌 Ruta GET /posts/author/:authorId - Obtiene todas las publicaciones de un autor específico
router.get('/author/:authorId', verifyToken, async (req, res) => {
    try {
      const { authorId } = req.params;  // Autor del que se quieren obtener las publicaciones

      // Buscar las publicaciones por el ID del autor
      const posts = await Post.find({ author: authorId });

      if (posts.length === 0) {
        return res.status(404).json({ message: 'No se encontraron publicaciones para este autor' });
      }

      return res.status(200).json({ posts });

    } catch (error) {
      console.error('[Error al obtener publicaciones del autor]:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;