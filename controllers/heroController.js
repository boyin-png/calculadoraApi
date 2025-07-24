import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as heroService from '../services/heroServices.js';

const router = express.Router();

router.get('/heroes', protect, async (req, res) => {
    try {
        const hero = await heroService.getHeroForUser(req.user._id);
        res.json(hero || {});
    } catch (error) { res.status(500).json({ message: error.message }); }
});
router.post('/heroes', protect, async (req, res) => {
    try {
        const hero = await heroService.addHeroForUser(req.body, req.user._id);
        res.status(201).json(hero);
    } catch (error) { res.status(400).json({ message: error.message }); }
});
router.put('/heroes/:id', protect, async (req, res) => {
    try {
        const updatedHero = await heroService.updateHeroForUser(req.params.id, req.body, req.user._id);
        if (!updatedHero) return res.status(404).json({ message: "Héroe no encontrado o no te pertenece" });
        res.json(updatedHero);
    } catch (error) { res.status(400).json({ message: error.message }); }
});
router.delete('/heroes/:id', protect, async (req, res) => {
    try {
        const result = await heroService.deleteHeroForUser(req.params.id, req.user._id);
        if (!result) return res.status(404).json({ message: "Héroe no encontrado o no te pertenece" });
        res.json({ message: 'Héroe y sus mascotas han sido eliminados' });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

export default router;