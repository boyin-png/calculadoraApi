import Pet from '../models/petModel.js';

export const findPetsByUserId = async (userId) => {
    return Pet.find({ user: userId });
};

export const createPetForUser = async (petData, userId) => {
    const pet = new Pet({
        ...petData,
        user: userId
    });
    return pet.save();
};

export const updatePetForUser = async (petId, petData, userId) => {
    return Pet.findOneAndUpdate({ _id: petId, user: userId }, petData, { new: true });
};

export const deletePetForUser = async (petId, userId) => {
    return Pet.findOneAndDelete({ _id: petId, user: userId });
};

// --- NUEVA FUNCIÓN ---
// Elimina todas las mascotas que pertenecen a un héroe y a un usuario.
export const deletePetsByOwnerId = async (heroId, userId) => {
    // Usamos deleteMany para borrar todos los documentos que coincidan con el criterio.
    return Pet.deleteMany({ ownerId: heroId, user: userId });
};