import Pet from '../models/petModel.js';

export const findPetsByUserId = async (userId) => {
    return Pet.find({ user: userId });
};

export const createPetForUser = async (petData, userId) => {
    const pet = new Pet({ ...petData, user: userId });
    return pet.save();
};

export const updatePet = async (petId, petData, userId) => {
    return Pet.findOneAndUpdate({ _id: petId, user: userId }, petData, { new: true });
};

export const deletePet = async (petId, userId) => {
    return Pet.findOneAndDelete({ _id: petId, user: userId });
};

// Función para borrar las mascotas de un héroe cuando este es eliminado
export const deletePetsByOwnerHeroId = async (heroId) => {
    return Pet.deleteMany({ ownerId: heroId });
};