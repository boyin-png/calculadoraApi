import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ Base de Datos MongoDB Conectada: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión a la Base de Datos: ${error.message}`);
        process.exit(1); // Detiene la aplicación si no se puede conectar
    }
};

export default connectDB;