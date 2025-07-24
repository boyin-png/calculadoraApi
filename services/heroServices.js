import * as heroRepository from '../repositories/heroRepository.js';
import * as petRepository from '../repositories/petRepository.js';

export const getHeroForUser = (userId) => heroRepository.findHeroByUserId(userId).populate('pets');
export const addHeroForUser = async (heroData, userId) => {
    const existingHero = await heroRepository.findHeroByUserId(userId);
    if (existingHero) throw new Error('Ya tienes un héroe avatar.');
    return heroRepository.createHeroForUser(heroData, userId);
};
export const updateHeroForUser = (heroId, heroData, userId) => heroRepository.updateHero(heroId, heroData, userId);
export const deleteHeroForUser = async (heroId, userId) => {
    const hero = await heroRepository.findHeroByIdAndUser(heroId, userId);
    if (!hero) throw new Error("Héroe no encontrado o no te pertenece.");
    await petRepository.deletePetsByOwnerId(hero._id);
    return heroRepository.deleteHero(heroId, userId);
};