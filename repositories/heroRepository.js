import Hero from '../models/heroModel.js';

// Obtiene solo el héroe que pertenece a un ID de usuario específico
export const findHeroByUserId = async (userId) => {
    return Hero.findOne({ user: userId });
};

// Crea un nuevo héroe y le asigna el ID del usuario como dueño
export const createHeroForUser = async (heroData, userId) => {
    const hero = new Hero({
        ...heroData,
        user: userId 
    });
    return hero.save();
};

// Actualiza un héroe específico, verificando que pertenezca al usuario correcto
export const updateHero = async (heroId, heroData, userId) => {
    return Hero.findOneAndUpdate(
        { _id: heroId, user: userId }, 
        heroData, 
        { new: true }
    );
};

// Elimina un héroe específico, verificando que pertenezca al usuario correcto
export const deleteHero = async (heroId, userId) => {
    return Hero.findOneAndDelete({ _id: heroId, user: userId });
};

// --- NUEVAS FUNCIONES PARA EL REPOSITORIO ---

// Busca héroes por ciudad, pero solo los que pertenecen al usuario
export const findHeroesByCityAndUser = async (city, userId) => {
    // En la lógica de un solo héroe por usuario, esto también debería devolver uno solo.
    return Hero.find({ city: city, user: userId });
};

// Busca un único héroe para asegurar la pertenencia antes de una acción
export const findHeroByIdAndUser = async (heroId, userId) => {
    return Hero.findOne({ _id: heroId, user: userId });
};