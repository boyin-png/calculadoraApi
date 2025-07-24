import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as petService from '../services/petServices.js';

const router = express.Router();

// ... (tus otras rutas GET, POST, PUT, DELETE de mascotas aquí)

// --- RUTA DE ADOPCIÓN ---
// NOTA: La ruta de adopción tiene más sentido en el controlador de JUEGO, 
// pero la pongo aquí si prefieres tenerla junto a las mascotas.
// La movimos a gameController en la versión final.
router.post('/pets/adopt/:heroId/:petId', protect, async (req, res) => {
    try {
        const hero = await petService.adoptPetForUser(req.params.heroId, req.params.petId, req.user._id);
        res.json({ message: '¡Adopción exitosa!', hero });
    } catch (error) {
        // Devuelve el mensaje de error específico (ej: "ya tiene dueño")
        res.status(400).json({ message: "La adopción no fue exitosa.", reason: error.message });
    }
});


export default router;