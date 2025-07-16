import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Encripta la contraseña automáticamente antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar la contraseña ingresada con la guardada
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;