import fs from 'fs-extra';
import Hero from '../models/heroModel.js';

const filePath = './database/database.json';

// Exportamos cada función individualmente para mayor claridad
export async function getHeroes() {
    try {
        const data = await fs.readJson(filePath);
        return data.map(hero => new Hero(hero));
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

export async function saveHeroes(heroes) {
    try {
        await fs.writeJson(filePath, heroes, { spaces: 2 });
    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
        throw error;
    }
}