import * as heroRepository from '../repositories/heroRepository.js';
import * as petRepository from '../repositories/petRepository.js';

export const getHeroForUser = (userId) => {
    return heroRepository.findHeroByUserId(userId);
};

export const addHeroForUser = async (heroData, userId) => {
    const existingHero = await heroRepository.findHeroByUserId(userId);
    if (existingHero) {
        throw new Error('Ya tienes un héroe avatar. No puedes crear otro.');
    }
    return heroRepository.createHeroForUser(heroData, userId);
};

export const updateHeroForUser = (heroId, heroData, userId) => {
    return heroRepository.updateHero(heroId, heroData, userId);
};

export const deleteHeroForUser = async (heroId, userId) => {
    // 1. Buscamos al héroe para asegurarnos de que existe y pertenece al usuario
    const hero = await heroRepository.findHeroByIdAndUser(heroId, userId);
    if (!hero) {
        throw new Error("Héroe no encontrado o no te pertenece");
    }

    // 2. Eliminamos todas las mascotas cuyo ownerId sea el ID de este héroe
    await petRepository.deletePetsByOwnerId(hero._id, userId);

    // 3. Finalmente, eliminamos al héroe
    return heroRepository.deleteHero(heroId, userId);
};