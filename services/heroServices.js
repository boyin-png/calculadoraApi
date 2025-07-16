import * as heroRepository from '../repositories/heroRepository.js';
import * as petRepository from '../repositories/petRepository.js'; // Necesitaremos el repositorio de mascotas

// Obtiene el único héroe que le pertenece al usuario
export const getHeroForUser = (userId) => {
    return heroRepository.findHeroByUserId(userId);
};

// Añade un héroe SOLO SI el usuario no tiene ya uno
export const addHeroForUser = async (heroData, userId) => {
    // 1. Verificamos si el usuario ya tiene un héroe
    const existingHero = await heroRepository.findHeroByUserId(userId);
    if (existingHero) {
        throw new Error('Ya tienes un héroe avatar. No puedes crear otro. Elimina el actual primero.');
    }
    // 2. Si no tiene, procedemos a crear el nuevo héroe
    return heroRepository.createHeroForUser(heroData, userId);
};

// La función de actualizar no necesita cambios de lógica
export const updateHeroForUser = (heroId, heroData, userId) => {
    return heroRepository.updateHero(heroId, heroData, userId);
};

// Elimina al héroe Y a todas sus mascotas
export const deleteHeroForUser = async (heroId, userId) => {
    // 1. Eliminamos todas las mascotas cuyo dueño sea el ID de este héroe
    await petRepository.deletePetsByOwnerId(heroId, userId);

    // 2. Después de eliminar las mascotas, eliminamos al héroe
    const result = await heroRepository.deleteHero(heroId, userId);
    
    return result;
};