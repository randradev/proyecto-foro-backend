const jwt = require('jsonwebtoken');

// Middleware para proteger rutas
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Extraemos el token

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos la información decodificada del token en la solicitud
    next(); // Llamamos al siguiente middleware o ruta
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = verifyToken;