import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    // Campo para vincular al dueño
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Hace referencia al modelo de Usuario
    },
    // Atributos básicos
    name: { type: String, required: true },
    power: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    
    // --- ATRIBUTOS DE JUEGO RESTAURADOS ---
    // Lista de los IDs de las mascotas que ha adoptado
    pets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    // Monedero del héroe
    coins: {
        type: Number,
        default: 50 // Empieza con 50 monedas por defecto
    }
}, {
    timestamps: true // Añade automáticamente los campos createdAt y updatedAt
});

const Hero = mongoose.model('Hero', heroSchema);
export default Hero;