import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    user: { // El USUARIO dueño de esta mascota
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ownerId: { // El HÉROE dueño de esta mascota
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hero',
        default: null
    },
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
    }
}, { timestamps: true });

const Pet = mongoose.model('Pet', petSchema);
export default Pet;