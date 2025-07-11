import fs from 'fs-extra';
const filePath = './database/pets.json';

export async function getPets() {
    try {
        return await fs.readJson(filePath);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

export async function savePets(pets) {
    await fs.writeJson(filePath, pets, { spaces: 2 });
}