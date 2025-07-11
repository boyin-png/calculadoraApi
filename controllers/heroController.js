import express from "express";
import { check, validationResult } from 'express-validator';
// Importamos todas las funciones del servicio bajo el alias "heroService"
import * as heroService from "../services/heroServices.js";

const router = express.Router();

// GET /api/heroes
router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST /api/heroes
router.post("/heroes",
    [
        check('name').not().isEmpty(),
        check('power').not().isEmpty(),
        check('age').isNumeric(),
        check('city').not().isEmpty()
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const addedHero = await heroService.addHero(req.body);
            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

// PUT /api/heroes/:id
router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// DELETE /api/heroes/:id
router.delete('/heroes/:id', async (req, res) => {
    try {
        await heroService.deleteHero(req.params.id);
        res.status(200).json({ message: 'Héroe eliminado' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


export default router;