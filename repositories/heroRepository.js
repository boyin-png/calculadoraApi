import Hero from '../models/heroModel.js';

export const findHeroByUserId = async (userId) => {
    return Hero.findOne({ user: userId }).populate('pets');
};

export const createHeroForUser = async (heroData, userId) => {
    const existingHero = await Hero.findOne({ user: userId });
    if (existingHero) {
        throw new Error('El usuario ya tiene un héroe avatar.');
    }
    const hero = new Hero({ ...heroData, user: userId });
    return hero.save();
};

export const updateHero = async (heroId, heroData, userId) => {
    return Hero.findOneAndUpdate({ _id: heroId, user: userId }, heroData, { new: true });
};

export const deleteHero = async (heroId, userId) => {
    return Hero.findOneAndDelete({ _id: heroId, user: userId });
};