import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (userData) => {
    const { username, password } = userData;
    const userExists = await User.findOne({ username });

    if (userExists) {
        throw new Error('El nombre de usuario ya existe');
    }

    const user = await User.create({
        username,
        password
    });

    if (user) {
        return {
            _id: user._id,
            username: user.username,
            token: generateToken(user._id)
        };
    } else {
        throw new Error('Datos de usuario inválidos');
    }
};

export const loginUser = async (loginData) => {
    const { username, password } = loginData;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        return {
            _id: user._id,
            username: user.username,
            token: generateToken(user._id)
        };
    } else {
        throw new Error('Usuario o contraseña inválidos');
    }
};