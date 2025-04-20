const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Configuraciones
dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
  res.send('API funcionando 🟢');
});

// Importar rutas

// Autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // ruta base para autenticación

// CRUD usuarios
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Publicaciones
const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter);  // Ruta base para publicaciones

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});