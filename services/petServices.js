import * as petRepository from '../repositories/petRepository.js';

// --- FUNCIONES CRUD ---

export const getAllPetsForUser = (userId) => {
    return petRepository.findPetsByUserId(userId);
};

export const addPetForUser = (petData, userId) => {
    return petRepository.createPetForUser(petData, userId);
};

export const updatePetForUser = (petId, petData, userId) => {
    return petRepository.updatePetForUser(petId, petData, userId);
};

export const deletePetForUser = (petId, userId) => {
    return petRepository.deletePetForUser(petId, userId);
};

// --- FUNCIÓN DE ADOPCIÓN RESTAURADA Y ADAPTADA A MONGODB ---

export const adoptPetForUser = async (heroId, petId, userId) => {
    // 1. Buscamos al héroe y a la mascota en la base de datos
    const hero = await petRepository.findHeroById(heroId);
    const pet = await petRepository.findPetById(petId);

    // 2. Verificaciones
    if (!hero) throw new Error('Héroe no encontrado.');
    if (hero.user.toString() !== userId) throw new Error('No puedes hacer que un héroe que no te pertenece adopte una mascota.');
    
    if (!pet) throw new Error('Mascota no encontrada.');
    if (pet.user.toString() !== userId) throw new Error('No puedes adoptar una mascota que no te pertenece.');
    
    if (pet.ownerId) throw new Error('Esta mascota ya tiene un dueño (héroe).');

    // 3. Hacemos la asignación
    pet.ownerId = hero._id; // Asignamos el ID del héroe a la mascota
    hero.pets.push(pet._id); // Añadimos el ID de la mascota a la lista del héroe

    // 4. Guardamos los cambios en la base de datos
    await petRepository.savePet(pet);
    await petRepository.saveHero(hero);

    // 5. Devolvemos el héroe actualizado
    return hero;
};