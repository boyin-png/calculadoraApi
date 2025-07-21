import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as petService from '../services/petServices.js';
import { check, validationResult } from 'express-validator'; // <-- LÍNEA IMPORTANTE QUE FALTABA

const router = express.Router();

// GET /api/pets
router.get('/pets', protect, async (req, res) => {
    try {
        const pets = await petService.getAllPetsForUser(req.user._id);
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/pets
router.post('/pets', protect, [
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('animal', 'El tipo de animal es requerido').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const pet = await petService.addPetForUser(req.body, req.user._id);
        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/pets/:id
router.put('/pets/:id', protect, async (req, res) => {
    try {
        const updatedPet = await petService.updatePetForUser(req.params.id, req.body, req.user._id);
        if (!updatedPet) return res.status(404).json({ message: "Mascota no encontrada o no te pertenece" });
        res.json(updatedPet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/pets/:id
router.delete('/pets/:id', protect, async (req, res) => {
    try {
        const result = await petService.deletePetForUser(req.params.id, req.user._id);
        if (!result) return res.status(404).json({ message: "Mascota no encontrada o no te pertenece" });
        res.json({ message: 'Mascota eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;