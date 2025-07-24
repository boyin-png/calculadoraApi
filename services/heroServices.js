import * as heroRepository from '../repositories/heroRepository.js';
import * as petRepository from '../repositories/petRepository.js'; // Necesario para borrar mascotas

// Cada función ahora recibe el ID del usuario para asegurar que solo modifica sus propios datos.

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
    const hero = await heroRepository.findHeroByIdAndUser(heroId, userId);
    if (!hero) {
        throw new Error("Héroe no encontrado o no te pertenece.");
    }
    await petRepository.deletePetsByOwnerId(hero._id, userId);
    return heroRepository.deleteHero(heroId, userId);
};

// --- FUNCIONES RESTAURADAS Y VERIFICADAS ---

export const findHeroesByCityForUser = (city, userId) => {
    // Llama a una nueva función en el repositorio que filtra por ciudad Y por usuario
    return heroRepository.findHeroesByCityAndUser(city, userId);
};

export const faceVillainForUser = async (heroId, villainName, userId) => {
    // Primero, buscamos al héroe para asegurarnos de que pertenece al usuario
    const hero = await heroRepository.findHeroByIdAndUser(heroId, userId);
    if (!hero) {
        throw new Error('Héroe no encontrado o no te pertenece');
    }
    // Lógica del juego
    return `${hero.name} ahora enfrenta a ${villainName}!`;
};