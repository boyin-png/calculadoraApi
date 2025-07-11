import * as heroRepository from '../repositories/heroRepository.js';
import * as petRepository from '../repositories/petRepository.js';

// --- FUNCIÓN PRINCIPAL MEJORADA ---
async function getAllHeroes() {
    // 1. Obtenemos ambas listas de datos
    const heroes = await heroRepository.getHeroes();
    const allPets = await petRepository.getPets();

    // 2. "Rellenamos" los datos de las mascotas para cada héroe
    const populatedHeroes = heroes.map(hero => {
        // Para cada héroe, buscamos sus mascotas en la lista general
        const heroPets = hero.pets.map(petId => {
            return allPets.find(pet => pet.id === petId);
        }).filter(pet => pet); // .filter(pet => pet) elimina mascotas que no se encontraron

        // Devolvemos el héroe con la lista de mascotas completa en lugar de solo IDs
        return { ...hero, pets: heroPets };
    });

    return populatedHeroes;
}


// --- FUNCIONES RESTAURADAS ---

async function findHeroesByCity(city) {
    const heroes = await heroRepository.getHeroes();
    const heroesInCity = heroes.filter(hero => hero.city && hero.city.toLowerCase() === city.toLowerCase());
    
    if (heroesInCity.length === 0) {
        throw new Error(`No se encontraron músicos en la ciudad: ${city}`);
    }
    return heroesInCity;
}

async function faceVillain(heroId, villainName) {
    const heroes = await heroRepository.getHeroes();
    // Es importante encontrar al héroe específico para esta lógica
    const hero = heroes.find(h => h.id === parseInt(heroId));
    if (!hero) {
        throw new Error('Héroe (músico/sample) no encontrado');
    }
    // Para tu plataforma, esto podría ser "iniciar colaboración con..."
    return `${hero.name} ahora colabora con ${villainName}!`;
}


// --- RESTO DE FUNCIONES (sin cambios) ---

async function addHero(hero) {
    const heroes = await heroRepository.getHeroes();
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    const newHero = { id: newId, pets: [], ...hero };
    heroes.push(newHero);
    await heroRepository.saveHeroes(heroes);
    return newHero;
}

async function updateHero(id, heroDataToUpdate) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) throw new Error('Héroe no encontrado');

    delete heroDataToUpdate.id;
    heroes[index] = { ...heroes[index], ...heroDataToUpdate };

    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function deleteHero(id) {
    const heroes = await heroRepository.getHeroes();
    const initialLength = heroes.length;
    const filteredHeroes = heroes.filter(hero => hero.id !== parseInt(id));
    
    if (initialLength === filteredHeroes.length) {
        throw new Error('Héroe no encontrado para eliminar');
    }
    await heroRepository.saveHeroes(filteredHeroes);
    return { message: 'Héroe eliminado exitosamente' };
}

// Exportamos TODO, asegurándonos de no olvidar nada esta vez
export {
  getAllHeroes,
  addHero,
  updateHero,
  deleteHero,
  findHeroesByCity,
  faceVillain,
};