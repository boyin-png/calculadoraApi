import Pet from '../models/petModel.js';

export const findPetsByUserId = async (userId) => {
    return Pet.find({ user: userId });
};

export const createPetForUser = async (petData, userId) => {
    const pet = new Pet({ ...petData, user: userId });
    return pet.save();
};

export const updatePetForUser = async (petId, petData, userId) => {
    return Pet.findOneAndUpdate({ _id: petId, user: userId }, petData, { new: true });
};

// --- FUNCIÓN PARA ELIMINAR ---
export const deletePetForUser = async (petId, userId) => {
    return Pet.findOneAndDelete({ _id: petId, user: userId });
};