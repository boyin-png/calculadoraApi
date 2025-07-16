import * as petRepository from '../repositories/petRepository.js';
import * as heroRepository from '../repositories/heroRepository.js';
import fs from 'fs-extra';

let selectedPetId = null;

async function getFullState() {
    if (!selectedPetId) throw new Error('Debes seleccionar una mascota primero.');
    const allPets = await petRepository.getPets();
    const pet = allPets.find(p => p.id === selectedPetId);
    if (!pet) {
        selectedPetId = null;
        throw new Error('La mascota seleccionada ya no existe.');
    }
    const allHeroes = await heroRepository.getHeroes();
    const owner = pet.ownerId ? allHeroes.find(h => h.id === pet.ownerId) : null;
    return { pet, allPets, owner, allHeroes };
}

export async function selectPet(petId) {
    const pets = await petRepository.getPets();
    const pet = pets.find(p => p.id === parseInt(petId));
    if (!pet) throw new Error('La mascota no existe.');
    selectedPetId = pet.id;
    return { message: `${pet.name} ha sido seleccionado!` };
}

export function deselectPet() {
    if (!selectedPetId) throw new Error('No hay mascota seleccionada.');
    selectedPetId = null;
    return { message: `Has dejado de jugar.` };
}

export async function getPetStatus() {
    const { pet } = await getFullState();
    let lifePhase;
    if (pet.hp <= 0) lifePhase = 'Muerto 💀';
    else if (pet.health_status === 'enfermo') lifePhase = 'Enfermo 🤢';
    else if (pet.hp <= (pet.maxHp * 0.5)) lifePhase = 'Preocupante 😟';
    else if (pet.mood === 'aburrido') lifePhase = 'Saludable pero aburrido 😐';
    else lifePhase = 'Excelente y entretenido 😄';
    return { name: pet.name, hp: `${pet.hp}/${pet.maxHp}`, status: lifePhase, fashion: pet.fashion_status, accessories: pet.accessories };
}

export async function adoptPet(heroId, petId) {
    const heroes = await heroRepository.getHeroes();
    const pets = await petRepository.getPets();
    const heroIndex = heroes.findIndex(h => h.id === parseInt(heroId));
    if (heroIndex === -1) throw new Error('Héroe no encontrado.');
    const petIndex = pets.findIndex(p => p.id === parseInt(petId));
    if (petIndex === -1) throw new Error('Mascota no encontrada.');
    if (pets[petIndex].ownerId) throw new Error('Esta mascota ya tiene dueño.');
    pets[petIndex].ownerId = heroes[heroIndex].id;
    if (!heroes[heroIndex].pets) heroes[heroIndex].pets = [];
    heroes[heroIndex].pets.push(pets[petIndex].id);
    await heroRepository.saveHeroes(heroes);
    await petRepository.savePets(pets);
    return heroes[heroIndex];
}

export async function getAvailableFoods() { return fs.readJson('./database/foods.json'); }
export async function getAvailableAccessories() { return fs.readJson('./database/accessories.json'); }

export async function feedPet(foodName) {
    const { pet, allPets, owner, allHeroes } = await getFullState();
    if (pet.hp <= 0) return { message: `${pet.name} está muerto.` };
    const foods = await getAvailableFoods();
    const food = foods.find(f => f.name.toLowerCase() === foodName.toLowerCase());
    if (!food) throw new Error('Esa comida no existe.');
    if (!owner) throw new Error("La mascota debe tener dueño para comprar comida.");
    if (owner.coins < food.cost) throw new Error(`Monedas insuficientes. Cuesta ${food.cost}.`);

    if (pet.hp >= pet.maxHp) {
        pet.health_status = 'enfermo';
        await petRepository.savePets(allPets);
        return { message: `${pet.name} comió demasiado y se enfermó.` };
    }
    owner.coins -= food.cost;
    pet.hp = Math.min(pet.maxHp, pet.hp + food.hpRestore);
    await heroRepository.saveHeroes(allHeroes);
    await petRepository.savePets(allPets);
    return { message: `Alimentaste a ${pet.name}. (+${food.hpRestore} HP)`, newStatus: await getPetStatus() };
}

export async function walkPet() {
    const { pet, allPets } = await getFullState();
    if (pet.hp <= 0) return { message: `${pet.name} está muerto.` };
    if (pet.mood === 'entretenido') {
        pet.health_status = 'enfermo';
        await petRepository.savePets(allPets);
        return { message: `${pet.name} paseó de más y se enfermó.` };
    }
    pet.mood = 'entretenido';
    await petRepository.savePets(allPets);
    return { message: `Sacaste a pasear a ${pet.name}. ¡Está entretenido!`, newStatus: await getPetStatus() };
}

export async function giveMedicine(treatmentType) {
    const { pet, allPets, owner, allHeroes } = await getFullState();
    if (pet.health_status !== 'enfermo') throw new Error(`${pet.name} no está enfermo.`);
    const treatments = { basic: { cost: 10, hp: 10 }, advanced: { cost: 30, hp: 20 } };
    const treatment = treatments[treatmentType];
    if (!treatment) throw new Error("Tratamiento no válido.");
    if (!owner) throw new Error("La mascota debe tener dueño.");
    if (owner.coins < treatment.cost) throw new Error(`Monedas insuficientes.`);
    owner.coins -= treatment.cost;
    pet.hp = Math.min(pet.maxHp, pet.hp + treatment.hp);
    pet.health_status = 'saludable';
    await heroRepository.saveHeroes(allHeroes);
    await petRepository.savePets(allPets);
    return { message: `¡Curaste a ${pet.name}!`, petStatus: await getPetStatus() };
}

export async function equipAccessory(accessoryName) {
    const { pet, allPets, owner, allHeroes } = await getFullState();
    if (!owner) throw new Error("Mascota sin dueño no puede equipar.");
    const accessories = await getAvailableAccessories();
    const accessory = accessories.find(acc => acc.name.toLowerCase() === accessoryName.toLowerCase());
    if (!accessory) throw new Error("Accesorio no existe.");
    if (owner.coins < accessory.cost) throw new Error(`Monedas insuficientes. Cuesta ${accessory.cost}.`);
    if (pet.accessories[accessory.type]) throw new Error(`Ya tienes un accesorio de tipo '${accessory.type}'.`);
    owner.coins -= accessory.cost;
    pet.accessories[accessory.type] = accessory.name;
    pet.hp += accessory.hpBonus;
    pet.maxHp += accessory.hpBonus;
    pet.fashion_status = 'en-la-moda';
    await heroRepository.saveHeroes(allHeroes);
    await petRepository.savePets(allPets);
    return { message: `¡${pet.name} equipado con ${accessory.name}!`, petStatus: await getPetStatus() };
}

export async function revivePet() {
    const { pet, allPets, owner, allHeroes } = await getFullState();
    if (pet.hp > 0) throw new Error(`${pet.name} no está muerto.`);
    if (!owner) throw new Error("Una mascota sin dueño no puede ser revivida.");
    const revivalCost = 100;
    if (owner.coins < revivalCost) throw new Error(`No tienes suficientes monedas. Necesitas ${revivalCost}.`);
    owner.coins -= revivalCost;
    pet.hp = pet.maxHp;
    pet.health_status = 'saludable';
    pet.mood = 'entretenido';
    await heroRepository.saveHeroes(allHeroes);
    await petRepository.savePets(allPets);
    return { message: `✨ ¡Milagro! Reviviste a ${pet.name}.`, petStatus: await getPetStatus() };
}