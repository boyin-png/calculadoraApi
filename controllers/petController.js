import express from "express";
import * as petService from "../services/petServices.js";

const router = express.Router();

router.post("/heroes/:heroId/adopt/:petId", async (req, res) => {
    try {
        const { heroId, petId } = req.params;
        const updatedHero = await petService.adoptPet(heroId, petId);
        res.json(updatedHero);
    } catch (error) {
        // Usamos status 400 para errores de lógica de negocio (ej. ya tiene dueño)
        res.status(400).json({ error: error.message });
    }
});

// GET /api/pets
router.get("/pets", async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/pets
router.post("/pets", async (req, res) => {
    try {
        const newPet = await petService.addPet(req.body);
        res.status(201).json(newPet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/pets/:id
router.put("/pets/:id", async (req, res) => {
    try {
        const updatedPet = await petService.updatePet(req.params.id, req.body);
        res.json(updatedPet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// DELETE /api/pets/:id
router.delete("/pets/:id", async (req, res) => {
    try {
        await petService.deletePet(req.params.id);
        res.status(200).json({ message: "Mascota eliminada correctamente" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;