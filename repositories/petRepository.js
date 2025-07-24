import Pet from '../models/petModel.js';
export const findPetsByUserId = (userId) => Pet.find({ user: userId });
export const createPetForUser = (petData, userId) => new Pet({ ...petData, user: userId }).save();
export const updatePet = (petId, petData, userId) => Pet.findOneAndUpdate({ _id: petId, user: userId }, petData, { new: true }); // <--- CORRECCIÓN CRÍTICA
export const deletePet = (petId, userId) => Pet.findOneAndDelete({ _id: petId, user: userId });
export const deletePetsByOwnerId = (heroId) => Pet.deleteMany({ ownerId: heroId });