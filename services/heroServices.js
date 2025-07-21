import * as heroRepository from '../repositories/heroRepository.js';
import * as petRepository from '../repositories/petRepository.js'; // Importante que esté aquí

// Obtiene el único héroe avatar que le pertenece al usuario
export const getHeroForUser = (userId) => {
    return heroRepository.findHeroByUserId(userId);
};

// Añade un héroe SOLO SI el usuario no tiene ya uno
export const addHeroForUser = async (heroData, userId) => {
    const existingHero = await heroRepository.findHeroByUserId(userId);
    if (existingHero) {
        throw new Error('Ya tienes un héroe avatar. No puedes crear otro.');
    }
    return heroRepository.createHeroForUser(heroData, userId);
};

// La función de actualizar no necesita cambios
export const updateHeroForUser = (heroId, heroData, userId) => {
    return heroRepository.updateHero(heroId, heroData, userId);
};

// Elimina al héroe Y a todas sus mascotas
export const deleteHeroForUser = async (heroId, userId) => {
    // 1. Llama a la nueva función para eliminar las mascotas del héroe
    await petRepository.deletePetsByOwnerId(heroId, userId);

    // 2. Después, elimina al héroe
    const result = await heroRepository.deleteHero(heroId, userId);
    
    return result;
};