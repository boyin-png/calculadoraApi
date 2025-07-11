// Importamos las funciones específicas que necesitamos del repositorio
import { getHeroes, saveHeroes } from '../repositories/heroRepository.js';
import Hero from '../models/heroModel.js';

// --- FUNCIONES CRUD PRINCIPALES ---

export async function getAllHeroes() {
    // Llama directamente a la función importada
    return getHeroes();
}

export async function addHero(heroData) {
    const heroes = await getHeroes();
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    // Usamos el HeroModel para dar forma a los datos, incluyendo el array de mascotas vacío
    const newHero = new Hero({ id: newId, ...heroData, pets: [] });
    heroes.push(newHero);
    await saveHeroes(heroes);
    return newHero;
}

export async function updateHero(id, heroDataToUpdate) {
    const heroes = await getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    // Actualiza el héroe sin cambiar su ID
    delete heroDataToUpdate.id;
    heroes[index] = { ...heroes[index], ...heroDataToUpdate };
    
    await saveHeroes(heroes);
    return heroes[index];
}

export async function deleteHero(id) {
    const heroes = await getHeroes();
    const initialLength = heroes.length;
    const filteredHeroes = heroes.filter(hero => hero.id !== parseInt(id));

    if (initialLength === filteredHeroes.length) {
        throw new Error('Héroe no encontrado para eliminar');
    }
    await saveHeroes(filteredHeroes);
    return { message: 'Héroe eliminado' };
}

// --- FUNCIONES RESTAURADAS Y VERIFICADAS ---

export async function findHeroesByCity(city) {
    const heroes = await getHeroes(); // Usa la función importada
    const heroesInCity = heroes.filter(hero => hero.city && hero.city.toLowerCase() === city.toLowerCase());

    if (heroesInCity.length === 0) {
        throw new Error(`No se encontraron músicos en la ciudad: ${city}`);
    }
    return heroesInCity;
}

export async function faceVillain(heroId, villainName) {
    const heroes = await getHeroes(); // Usa la función importada
    const hero = heroes.find(h => h.id === parseInt(heroId));

    if (!hero) {
        throw new Error('Músico/Sample no encontrado');
    }
    // Lógica para tu plataforma, como una colaboración.
    return `${hero.name} ahora colabora con ${villainName}!`;
}