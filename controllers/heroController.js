import express from "express";
import { check, validationResult } from 'express-validator';
import * as heroService from "../services/heroServices.js";
import Hero from "../models/heroModel.js";

const router = express.Router();

// GET /heroes - Obtiene héroes y mascotas disponibles
router.get("/heroes", async (req, res) => {
    try {
        const data = await heroService.getAllHeroes();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /heroes - Crea un nuevo héroe
router.post("/heroes",
    [
        check('name').not().isEmpty(),
        check('power').not().isEmpty(),
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

// PUT /heroes/:id - Actualiza un héroe
router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// DELETE /heroes/:id - Elimina un héroe
router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


// --- RUTAS RESTAURADAS ---

// GET /heroes/city/:city - Busca por ciudad
router.get('/heroes/city/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const heroes = await heroService.findHeroesByCity(city);
        res.json(heroes);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /heroes/:id/face-villain - Inicia una "colaboración"
router.post('/heroes/:id/face-villain', async (req, res) => {
    try {
        const heroId = req.params.id;
        const { villainName } = req.body;
        if (!villainName) {
            return res.status(400).json({ error: 'El "villainName" (nombre del colaborador) es requerido en el body.' });
        }
        const result = await heroService.faceVillain(heroId, villainName);
        res.json({ message: result });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;