import * as petRepository from '../repositories/petRepository.js';
import * as heroRepository from '../repositories/heroRepository.js'; // Necesario para adoptar

export const getAllPetsForUser = (userId) => {
    return petRepository.findPetsByUserId(userId);
};

export const addPetForUser = (petData, userId) => {
    return petRepository.createPetForUser(petData, userId);
};

export const updatePetForUser = (petId, petData, userId) => {
    return petRepository.updatePetForUser(petId, petData, userId);
};

// --- FUNCIÓN RESTAURADA ---
export const deletePetForUser = (petId, userId) => {
    return petRepository.deletePetForUser(petId, userId);
};

// --- FUNCIÓN DE ADOPCIÓN (CONECTADA A MONGODB) ---
export const adoptPetForUser = async (heroId, petId, userId) => {
    const hero = await heroRepository.findOneHeroByIdAndUser(heroId, userId);
    if (!hero) throw new Error('Héroe no encontrado o no te pertenece.');
    
    const pet = await petRepository.findPetsByUserId(userId).then(pets => pets.find(p => p._id.toString() === petId));
    if (!pet) throw new Error('Mascota no encontrada o no te pertenece.');
    
    if (pet.ownerId) throw new Error('Esta mascota ya tiene un dueño.');

    pet.ownerId = hero._id;
    hero.pets.push(pet._id);

    await hero.save();
    await pet.save();
    
    return hero;
};