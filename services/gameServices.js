import * as petRepository from '../repositories/petRepository.js';
import * as heroRepository from '../repositories/heroRepository.js';
import Hero from '../models/heroModel.js'; // Necesitamos los modelos para buscar en la BD
import Pet from '../models/petModel.js';   // Necesitamos los modelos para buscar en la BD
import fs from 'fs-extra';

let selectedPetId = null;

// --- FUNCIÓN DE ADOPCIÓN CORREGIDA PARA MONGODB ---
export async function adoptPet(heroId, petId, userId) {
    // 1. Buscamos al héroe y a la mascota en la BD, asegurándonos que pertenecen al usuario
    const hero = await Hero.findOne({ _id: heroId, user: userId });
    if (!hero) throw new Error('Héroe no encontrado o no te pertenece.');

    const pet = await Pet.findOne({ _id: petId, user: userId });
    if (!pet) throw new Error('Mascota no encontrada o no te pertenece.');
    
    if (pet.ownerId) throw new Error('Esta mascota ya tiene un dueño (héroe).');

    // 2. Hacemos la asignación
    pet.ownerId = hero._id;
    hero.pets.push(pet._id);

    // 3. Guardamos los cambios en la base de datos
    await pet.save();
    await hero.save();
    
    return hero;
}

export async function selectPet(petId, userId) {
    const pet = await Pet.findOne({ _id: petId, user: userId });
    if (!pet) throw new Error('Mascota no encontrada o no te pertenece.');
    userSessions[userId] = pet._id.toString();
    return { message: `${pet.name} ha sido seleccionado!` };
}

export function deselectPet(userId) {
    if (!userSessions[userId]) throw new Error('No hay ninguna mascota seleccionada.');
    delete userSessions[userId];
    return { message: `Has dejado de jugar.` };
}

export async function getPetStatus(userId) {
    const { pet } = await getState(userId);
    let lifePhase;
    if (pet.hp <= 0) lifePhase = 'Muerto 💀';
    else if (pet.health_status === 'enfermo') lifePhase = 'Enfermo 🤢';
    else if (pet.hp <= (pet.maxHp * 0.5)) lifePhase = 'Preocupante 😟';
    else if (pet.mood === 'aburrido') lifePhase = 'Saludable pero aburrido 😐';
    else lifePhase = 'Excelente y entretenido 😄';
    return { name: pet.name, hp: `${pet.hp}/${pet.maxHp}`, status: lifePhase, fashion: pet.fashion_status, accessories: pet.accessories };
}

export async function getAvailableFoods() {
    return fs.readJson('./database/foods.json');
}

export async function getAvailableAccessories() {
    return fs.readJson('./database/accessories.json');
}

export async function feedPet(foodName, userId) {
    const { pet, owner } = await getState(userId);
    if (pet.hp <= 0) return { message: `${pet.name} está muerto.` };

    const foods = await getAvailableFoods();
    const food = foods.find(f => f.name.toLowerCase() === foodName.toLowerCase());
    if (!food) throw new Error('Esa comida no existe.');
    if (!owner) throw new Error("La mascota debe tener un héroe dueño para comprar comida.");
    if (owner.coins < food.cost) throw new Error(`Monedas insuficientes. Cuesta ${food.cost}.`);

    if (pet.hp >= pet.maxHp) {
        pet.health_status = 'enfermo';
    } else {
        pet.hp = Math.min(pet.maxHp, pet.hp + food.hpRestore);
        owner.coins -= food.cost;
        await owner.save();
    }
    await pet.save();
    return { message: `Alimentaste a ${pet.name}. (+${food.hpRestore} HP)`, newStatus: await getPetStatus(userId) };
}

export async function walkPet(userId) {
    const { pet, owner } = await getState(userId);
    if (pet.hp <= 0) return { message: `${pet.name} está muerto.` };

    if (pet.mood === 'entretenido') {
        pet.health_status = 'enfermo';
    } else {
        pet.mood = 'entretenido';
        if (owner) {
            owner.coins += 3;
            await owner.save();
        }
    }
    await pet.save();
    return { message: `Sacaste a pasear a ${pet.name}.`, newStatus: await getPetStatus(userId) };
}

export async function giveMedicine(treatmentType, userId) {
    const { pet, owner } = await getState(userId);
    if (pet.health_status !== 'enfermo') throw new Error(`${pet.name} no está enfermo.`);
    const treatments = { basic: { cost: 10, hp: 10 }, advanced: { cost: 30, hp: 20 } };
    const treatment = treatments[treatmentType];
    if (!treatment) throw new Error("Tratamiento no válido.");
    if (!owner) throw new Error("La mascota debe tener dueño.");
    if (owner.coins < treatment.cost) throw new Error(`Monedas insuficientes.`);

    owner.coins -= treatment.cost;
    pet.hp = Math.min(pet.maxHp, pet.hp + treatment.hp);
    pet.health_status = 'saludable';
    await owner.save();
    await pet.save();
    return { message: `¡Curaste a ${pet.name}!`, petStatus: await getPetStatus(userId) };
}

export async function equipAccessory(accessoryName, userId) {
    const { pet, owner } = await getState(userId);
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
    await owner.save();
    await pet.save();
    return { message: `¡${pet.name} equipado con ${accessory.name}!`, petStatus: await getPetStatus(userId) };
}

export async function revivePet(userId) {
    const { pet, owner } = await getState(userId);
    if (pet.hp > 0) throw new Error(`${pet.name} no está muerto.`);
    if (!owner) throw new Error("Una mascota sin dueño no puede ser revivida.");
    const revivalCost = 100;
    if (owner.coins < revivalCost) throw new Error(`No tienes suficientes monedas. Necesitas ${revivalCost}.`);

    owner.coins -= revivalCost;
    pet.hp = pet.maxHp;
    pet.health_status = 'saludable';
    pet.mood = 'entretenido';
    await owner.save();
    await pet.save();
    return { message: `✨ ¡Milagro! Reviviste a ${pet.name}.`, petStatus: await getPetStatus(userId) };
}