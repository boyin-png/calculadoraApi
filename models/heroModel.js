import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Guarda el ID del USUARIO
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    power: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    pets: [{ // Guarda una lista de IDs de MASCOTAS
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    coins: { type: Number, default: 50 }
}, { timestamps: true });

const Hero = mongoose.model('Hero', heroSchema);
export default Hero;