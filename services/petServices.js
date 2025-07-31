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
export const addPetForUser = async (petData, userId) => {
    // 1. Crear la mascota
    const pet = await petRepository.createPetForUser(petData, userId);
    
    // 2. Buscar el héroe del usuario para auto-adopción
    const hero = await Hero.findOne({ user: userId });
    if (hero) {
        // 3. Auto-adoptar la mascota recién creada
        pet.ownerId = hero._id;
        hero.pets.push(pet._id);
        
        // 4. Guardar los cambios
        await pet.save();
        await hero.save();
    }
    
    return pet;
};
export const updatePetForUser = (petId, petData, userId) => {
    return petRepository.updatePet(petId, petData, userId);
};
export const deletePetForUser = (petId, userId) => {
    return petRepository.deletePet(petId, userId);
};