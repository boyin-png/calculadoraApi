// boyin-png/calculadoraapi/calculadoraApi-aabc0255821b7bab8ff4a86b9916b293f4531daf/controllers/petController.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as petService from '../services/petServices.js';

const router = express.Router();

// PROTEGEMOS TODAS LAS RUTAS DE MASCOTAS

// GET /api/pets - Obtiene todas las mascotas del usuario logueado
router.get('/', protect, async (req, res) => {
    try {
        const pets = await petService.getAllPetsForUser(req.user._id);
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/pets - Crea una nueva mascota para el usuario logueado
router.post('/', protect, async (req, res) => {
    try {
        const pet = await petService.addPetForUser(req.body, req.user._id);
        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/pets/:id - Actualiza una mascota del usuario
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedPet = await petService.updatePetForUser(req.params.id, req.body, req.user._id);
        if (!updatedPet) {
            return res.status(404).json({ message: "Mascota no encontrada o no te pertenece" });
        }
        res.json(updatedPet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/pets/:id - Elimina una mascota del usuario
router.delete('/:id', protect, async (req, res) => {
    try {
        const result = await petService.deletePetForUser(req.params.id, req.user._id);
        if (!result) {
            return res.status(404).json({ message: "Mascota no encontrada o no te pertenece" });
        }
        res.json({ message: 'Mascota eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;