import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as petService from '../services/petServices.js';

const router = express.Router();

router.get('/pets', protect, async (req, res) => {
    try {
        const pets = await petService.getAllPetsForUser(req.user._id);
        res.json(pets);
    } catch (error) { res.status(500).json({ message: error.message }); }
});
router.post('/pets', protect, async (req, res) => {
    try {
        const pet = await petService.addPetForUser(req.body, req.user._id);
        res.status(201).json(pet);
    } catch (error) { res.status(400).json({ message: error.message }); }
});
router.put('/pets/:id', protect, async (req, res) => {
    try {
        const updatedPet = await petService.updatePetForUser(req.params.id, req.body, req.user._id);
        if (!updatedPet) return res.status(404).json({ message: "Mascota no encontrada o no te pertenece" });
        res.json(updatedPet);
    } catch (error) { res.status(400).json({ message: error.message }); }
});
router.delete('/pets/:id', protect, async (req, res) => {
    try {
        const result = await petService.deletePetForUser(req.params.id, req.user._id);
        if (!result) return res.status(404).json({ message: "Mascota no encontrada o no te pertenece" });
        res.json({ message: 'Mascota eliminada' });
    } catch (error) { res.status(500).json({ message: error.message }); }
});
router.post('/pets/adopt/:heroId/:petId', protect, async (req, res) => {
    try {
        const hero = await petService.adoptPetForUser(req.params.heroId, req.params.petId, req.user._id);
        res.json({ message: '¡Adopción exitosa!', hero });
    } catch (error) { res.status(400).json({ message: error.message }); }
});

export default router;