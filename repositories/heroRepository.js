import Hero from '../models/heroModel.js';

// CAMBIADO: Ahora busca un solo héroe por el ID de usuario, ya que solo puede haber uno.
export const findHeroByUserId = async (userId) => {
    return Hero.findOne({ user: userId });
};

export const createHeroForUser = async (heroData, userId) => {
    const hero = new Hero({
        ...heroData,
        user: userId
    });
    return hero.save();
};

export const updateHero = async (heroId, heroData, userId) => {
    return Hero.findOneAndUpdate(
        { _id: heroId, user: userId },
        heroData,
        { new: true }
    );
};

export const deleteHero = async (heroId, userId) => {
    return Hero.findOneAndDelete({ _id: heroId, user: userId });
};