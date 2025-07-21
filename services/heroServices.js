import * as heroRepository from '../repositories/heroRepository.js';
import * as petRepository from '../repositories/petRepository.js';

export const getHeroForUser = (userId) => {
    return heroRepository.findHeroByUserId(userId);
};

export const addHeroForUser = (heroData, userId) => {
    return heroRepository.createHeroForUser(heroData, userId);
};

export const updateHeroForUser = (heroId, heroData, userId) => {
    return heroRepository.updateHero(heroId, heroData, userId);
};

export const deleteHeroForUser = async (heroId, userId) => {
    const hero = await heroRepository.findHeroByUserId(userId);
    if (!hero || hero._id.toString() !== heroId) {
        throw new Error("Héroe no encontrado o no pertenece al usuario.");
    }
    
    // Elimina las mascotas asociadas
    await petRepository.deletePetsByOwnerHeroId(hero._id);
    
    // Elimina al héroe
    return heroRepository.deleteHero(heroId, userId);
};