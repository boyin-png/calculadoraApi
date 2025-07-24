import * as petRepository from '../repositories/petRepository.js';
import * as heroRepository from '../repositories/heroRepository.js';
import Hero from '../models/heroModel.js';
import Pet from '../models/petModel.js';

// --- LÓGICA DE ADOPCIÓN CON MENSAJES DE ERROR CLAROS ---
export const adoptPetForUser = async (heroId, petId, userId) => {
    // 1. Buscamos al héroe y a la mascota en la BD, asegurándonos que pertenecen al usuario
    const hero = await heroRepository.findHeroByIdAndUser(heroId, userId);
    if (!hero) {
        throw new Error('Héroe no encontrado o no te pertenece.');
    }
    
    const pet = await Pet.findOne({ _id: petId, user: userId });
    if (!pet) {
        throw new Error('Mascota no encontrada o no te pertenece.');
    }
    
    if (pet.ownerId) {
        // Mensaje de error si la adopción no es exitosa
        throw new Error(`La adopción no fue exitosa: ${pet.name} ya tiene un dueño.`);
    }

    // 2. Hacemos la asignación
    pet.ownerId = hero._id;
    hero.pets.push(pet._id);

    // 3. Guardamos los cambios en la base de datos
    await pet.save();
    await hero.save();
    
    return hero; // Devolvemos el héroe actualizado con su nueva mascota
};


// --- RESTO DE FUNCIONES CRUD PARA MASCOTAS ---
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