import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    power: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    
    // --- ESTA ES LA CORRECCIÓN CLAVE ---
    pets: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
        default: [] // Asegura que este campo sea SIEMPRE un array, aunque esté vacío
    },
    // -----------------------------------

    coins: {
        type: Number,
        default: 50
    }
}, {
    timestamps: true
});

const Hero = mongoose.model('Hero', heroSchema);
export default Hero;