import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import * as gameService from "../services/gameServices.js";

const router = express.Router();

router.post("/game/adopt/:heroId/:petId", protect, async (req, res) => {
    try {
        const { heroId, petId } = req.params;
        const result = await gameService.adoptPet(heroId, petId);
        res.json({ message: "¡Adopción exitosa!", hero: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/game/select/:petId", protect, async (req, res) => {
    try {
        const result = await gameService.selectPet(req.params.petId);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/game/deselect", protect, (req, res) => {
    try {
        const result = gameService.deselectPet();
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/game/status", protect, async (req, res) => {
    try {
        const status = await gameService.getPetStatus();
        res.json(status);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/game/foods", protect, async (req, res) => {
    try {
        const foods = await gameService.getAvailableFoods();
        res.json(foods);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
});

router.post("/game/feed", protect, async (req, res) => {
    try {
        const { foodName } = req.body;
        if (!foodName) return res.status(400).json({ error: "Falta 'foodName' en el body." });
        const result = await gameService.feedPet(foodName);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/game/walk", protect, async (req, res) => {
    try {
        const result = await gameService.walkPet();
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/game/give-medicine", protect, async (req, res) => {
    try {
        const { treatment } = req.body;
        if (!treatment) return res.status(400).json({ error: "Falta 'treatment' en el body." });
        const result = await gameService.giveMedicine(treatment);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/game/accessories", protect, async (req, res) => {
    try {
        const accessories = await gameService.getAvailableAccessories();
        res.json(accessories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/game/equip", protect, async (req, res) => {
    try {
        const { accessoryName } = req.body;
        if (!accessoryName) return res.status(400).json({ error: "Falta 'accessoryName' en el body." });
        const result = await gameService.equipAccessory(accessoryName);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/game/revive", protect, async (req, res) => {
    try {
        const result = await gameService.revivePet();
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;