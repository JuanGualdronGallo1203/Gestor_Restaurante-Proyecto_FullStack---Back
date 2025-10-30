const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { getDb } = require('./db'); // Importamos la función para obtener la DB
const { ObjectId } = require('mongodb'); // Para buscar por _id

// Opciones para la estrategia JWT
const options = {
  // 1. Dónde buscar el token:
  // En este caso, lo buscaremos en el header 'Authorization'
  // como un "Bearer Token" (Ej: "Bearer <token...>")
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  
  // 2. La clave secreta para verificar la firma del token:
  // DEBE ser la misma que usaste en tu .env
  secretOrKey: process.env.JWT_SECRET,
};

/**
 * Esta es la función principal de la estrategia.
 * Se ejecuta CADA VEZ que un usuario hace una petición a una ruta protegida.
 * @param {object} jwt_payload - El contenido decodificado del token (lo que guardamos al hacer login).
 * @param {function} done - Callback de Passport.
 */
const strategy = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    // 1. Obtener la conexión a la base de datos
    const db = getDb();
    
    // 2. Buscar al usuario en la DB con el ID que guardamos en el token
    // Asumimos que en el payload del token guardaremos el 'sub' (subject) como el _id
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(jwt_payload.sub) 
    });

    // 3. Evaluar si el usuario existe
    if (user) {
      // Sí existe. Pasa el objeto 'user' al 'req.user'
      // No pasamos la contraseña, solo la info segura
      const { password, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword); 
    } else {
      // No existe (ej. el usuario fue eliminado)
      return done(null, false); 
    }
  } catch (error) {
    // Hubo un error en la base de datos
    return done(error, false);
  }
});

// Exportamos una función que recibe la instancia de 'passport'
// y le dice que "use" la estrategia que acabamos de definir.
module.exports = (passport) => {
  passport.use(strategy);
};