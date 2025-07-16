// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrae el token del header (formato: "Bearer TOKEN...")
            token = req.headers.authorization.split(' ')[1];

            // Verifica que el token sea válido
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Busca al usuario del token en la BD y lo adjunta a la petición
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Deja pasar a la siguiente función (el controlador)
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, el token falló' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

export { protect };