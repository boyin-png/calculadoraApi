import mongoose from 'mongoose';
const petSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero', default: null },
    name: { type: String, required: true },
    animal: { type: String, required: true },
    superpower: { type: String, required: true },
    hp: { type: Number, default: 10 },
    maxHp: { type: Number, default: 10 },
    health_status: { type: String, default: 'saludable' },
    mood: { type: String, default: 'aburrido' },
    fashion_status: { type: String, default: 'quiere-estar-a-la-moda' },
    accessories: {
        sombrero: { type: String, default: null },
        lentes: { type: String, default: null },
        ropa: { type: String, default: null }
    },
    lastUpdate: { type: Date, default: Date.now },
    animalImage: { type: String, default: 'perro.jpg' } // Imagen por defecto para el perro
}, { timestamps: true });
const Pet = mongoose.model('Pet', petSchema);
export default Pet;