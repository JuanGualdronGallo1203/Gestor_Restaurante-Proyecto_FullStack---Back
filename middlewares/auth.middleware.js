const passport = require('passport');

/**
 * Middleware para verificar si el usuario está autenticado (JWT Válido).
 * Usa la estrategia 'jwt' que definimos en /config/passport.js
 */
const isAuthenticated = passport.authenticate('jwt', { session: false });

/**
 * Middleware para verificar si el usuario tiene el rol de 'administrador'.
 * Este middleware DEBE ejecutarse DESPUÉS de 'isAuthenticated',
 * ya que necesita que 'req.user' exista.
 */
const isAdminCheck = (req, res, next) => {
  // Asumimos que 'isAuthenticated' ya se ejecutó y 'req.user' está disponible
  if (req.user && req.user.role === 'administrador') {
    return next(); // El usuario es admin, puede continuar.
  }
  
  // Si no es admin, devolvemos un error 403 (Prohibido)
  return res.status(403).json({
    message: 'Acceso denegado. Se requiere rol de administrador.'
  });
};

/**
 * Exportamos 'isAdmin' como un ARRAY de middlewares.
 * Esto nos permite usar 'isAdmin' en una ruta y automáticamente
 * ejecutará primero 'isAuthenticated' y LUEGO 'isAdminCheck'.
 */
module.exports = {
  isAuthenticated,
  isAdmin: [isAuthenticated, isAdminCheck]
};