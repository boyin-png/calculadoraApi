import express from 'express';
import * as authService from '../services/authService.js'; // Lo crearemos ahora

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'El usuario y la contraseña son requeridos.' });
        }
        const data = await authService.registerUser({ username, password });
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'El usuario y la contraseña son requeridos.' });
        }
        const data = await authService.loginUser({ username, password });
        res.json(data);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

export default router;