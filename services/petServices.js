import * as petRepository from '../repositories/petRepository.js';
import Hero from '../models/heroModel.js'; // Necesitamos el modelo de Hero para la adopción

export const getAllPetsForUser = (userId) => {
    return petRepository.findPetsByUserId(userId);
};

export const addPetForUser = (petData, userId) => {
    return petRepository.createPetForUser(petData, userId);
};

export const updatePetForUser = (petId, petData, userId) => {
    return petRepository.updatePet(petId, petData, userId);
};

export const deletePetForUser = (petId, userId) => {
    return petRepository.deletePet(petId, userId);
};

export const adoptPetForUser = async (heroId, petId, userId) => {
    const hero = await Hero.findOne({ _id: heroId, user: userId });
    if (!hero) throw new Error('Héroe no encontrado o no te pertenece.');
    
    const pet = await Pet.findOne({ _id: petId, user: userId });
    if (!pet) throw new Error('Mascota no encontrada o no te pertenece.');
    if (pet.ownerId) throw new Error('Esta mascota ya tiene un dueño.');

    pet.ownerId = hero._id;
    hero.pets.push(pet._id);

    await pet.save();
    await hero.save();
    
    return hero;
};