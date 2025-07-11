import * as petRepository from '../repositories/petRepository.js';

export async function getAllPets() {
    return petRepository.getPets();
}

// --- NUEVA FUNCIÓN DE ADOPCIÓN ---
export async function adoptPet(heroId, petId) {
    // 1. Obtenemos todos los datos necesarios
    const heroes = await heroRepository.getHeroes();
    const pets = await petRepository.getPets();

    // 2. Buscamos al héroe y a la mascota
    const heroIndex = heroes.findIndex(h => h.id === parseInt(heroId));
    if (heroIndex === -1) throw new Error('Héroe no encontrado.');

    const petIndex = pets.findIndex(p => p.id === parseInt(petId));
    if (petIndex === -1) throw new Error('Mascota no encontrada.');

    // 3. Verificamos si la mascota ya tiene dueño
    if (pets[petIndex].ownerId) {
        throw new Error('Esta mascota (sample/instrumento) ya ha sido reclamada.');
    }

    // 4. Hacemos la asignación en ambas direcciones
    pets[petIndex].ownerId = heroes[heroIndex].id; // Asignamos el dueño a la mascota
    heroes[heroIndex].pets.push(pets[petIndex].id); // Asignamos la mascota al héroe

    // 5. Guardamos los cambios en AMBOS archivos
    await heroRepository.saveHeroes(heroes);
    await petRepository.savePets(pets);

    // 6. Devolvemos el héroe actualizado
    return heroes[heroIndex];
}

export async function addPet(petData) {
    const pets = await petRepository.getPets();
    const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 101;
    const newPet = { id: newId, status: 'disponible', ownerId: null, ...petData };
    pets.push(newPet);
    await petRepository.savePets(pets);
    return newPet;
}

export async function updatePet(id, petDataToUpdate) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    delete petDataToUpdate.id;
    pets[index] = { ...pets[index], ...petDataToUpdate };
    
    await petRepository.savePets(pets);
    return pets[index];
}

export async function deletePet(id) {
    const pets = await petRepository.getPets();
    const initialLength = pets.length;
    const filteredPets = pets.filter(p => p.id !== parseInt(id));
    
    if (initialLength === filteredPets.length) {
        throw new Error('Mascota no encontrada para eliminar');
    }
    await petRepository.savePets(filteredPets);
    return { message: 'Mascota eliminada' };
}