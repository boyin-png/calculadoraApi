import fs from 'fs-extra';
const filePath = './database/database.json';

export async function getHeroes() {
    try {
        return await fs.readJson(filePath);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

export async function saveHeroes(heroes) {
    await fs.writeJson(filePath, heroes, { spaces: 2 });
}