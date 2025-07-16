import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    // Campo para vincular al dueño
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // Atributos básicos
    name: { type: String, required: true },
    animal: { type: String, required: true },
    superpower: { type: String, required: true },

    // --- ATRIBUTOS DE JUEGO RESTAURADOS ---
    ownerId: { // Para saber qué héroe (no usuario) es el dueño directo
        type: Number,
        default: null
    },
    hp: {
        type: Number,
        default: 10
    },
    maxHp: {
        type: Number,
        default: 10
    },
    health_status: {
        type: String,
        default: 'saludable' // saludable, fatigado, enfermo, muerto
    },
    mood: {
        type: String,
        default: 'aburrido' // aburrido, entretenido
    },
    fashion_status: {
        type: String,
        default: 'quiere-estar-a-la-moda' // quiere-estar-a-la-moda, en-la-moda
    },
    accessories: {
        sombrero: { type: String, default: null },
        lentes: { type: String, default: null },
        ropa: { type: String, default: null }
    }
}, {
    timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet;