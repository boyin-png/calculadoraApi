import fs from 'fs-extra';
import Pet from '../models/petModel.js';

const filePath = './database/pets.json';

export async function getPets() {
    try {
        const data = await fs.readJson(filePath);
        return data.map(pet => new Pet(pet));
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

export async function savePets(pets) {
    await fs.writeJson(filePath, pets, { spaces: 2 });
}