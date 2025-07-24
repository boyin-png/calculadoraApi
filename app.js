import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';

// Importamos TODOS los controladores
import authController from './controllers/authController.js';
import heroController from './controllers/heroController.js';
import petController from './controllers/petController.js';
import gameController from './controllers/gameController.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE SWAGGER COMPLETA Y VERIFICADA ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API de Héroes y Mascotas (con Usuarios y MongoDB)',
    version: '2.0.0',
    description: 'Versión final de la API con sistema de usuarios, mascotas y juego interactivo.',
  },
    tags: [
    { name: 'Auth', description: 'Operaciones de Registro y Login de Usuarios.' },
    { name: 'Heroes', description: 'Operaciones CRUD para Héroes (requiere autenticación).' },
    { name: 'Mascotas', description: 'Operaciones CRUD para Mascotas (requiere autenticación).' },
    { name: 'Juego', description: 'Endpoints interactivos para jugar (requiere autenticación).' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
    schemas: {
      AuthInput: { type: "object", properties: { username: { type: "string", example: "farid" }, password: { type: "string", example: "password123" } } },
      HeroInput: { type: "object", properties: { name: { type: "string" }, power: { type: "string" }, age: { type: "integer" }, city: { type: "string" } } },
      PetInput: { type: "object", properties: { name: { type: "string" }, animal: { type: "string" }, superpower: { type: "string" } } }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // === Rutas de Autenticación ===
    "/api/auth/register": {
      post: { tags: ["Auth"], summary: "Registra un nuevo usuario", security: [], requestBody: { required: true, content: { "application/json": { schema: { $ref: '#/components/schemas/AuthInput' } } } }, responses: { "201": { description: "Usuario registrado" } } }
    },
    "/api/auth/login": {
      post: { tags: ["Auth"], summary: "Inicia sesión y obtiene un token", security: [], requestBody: { required: true, content: { "application/json": { schema: { $ref: '#/components/schemas/AuthInput' } } } }, responses: { "200": { description: "Login exitoso" } } }
    },
    // === Rutas de Héroes ===
    "/api/heroes": {
      get: { tags: ["Heroes"], summary: "Obtiene tu héroe avatar", responses: { "200": { description: "OK" } } },
      post: { tags: ["Heroes"], summary: "Crea tu único héroe avatar", requestBody: { required: true, content: { "application/json": { schema: { $ref: '#/components/schemas/HeroInput' } } } }, responses: { "201": { description: "Creado" } } }
    },
    "/api/heroes/{id}": {
      put: { tags: ["Heroes"], summary: "Actualiza tu héroe avatar", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: '#/components/schemas/HeroInput' } } } }, responses: { "200": { description: "Actualizado" } } },
      delete: { tags: ["Heroes"], summary: "Elimina tu héroe (y sus mascotas)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Eliminado" } } }
    },
    // === Rutas de Mascotas ===
    "/api/pets": {
      get: { tags: ["Mascotas"], summary: "Obtiene todas tus mascotas", responses: { "200": { description: "OK" } } },
      post: { tags: ["Mascotas"], summary: "Crea una nueva mascota", requestBody: { required: true, content: { "application/json": { schema: { $ref: '#/components/schemas/PetInput' } } } }, responses: { "201": { description: "Creada" } } }
    },
    "/api/pets/{id}": {
      put: { tags: ["Mascotas"], summary: "Actualiza una de tus mascotas", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: '#/components/schemas/PetInput' } } } }, responses: { "200": { description: "Actualizada" } } },
      delete: { tags: ["Mascotas"], summary: "Elimina una de tus mascotas", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Eliminada" } } }
    },
    // === Rutas del Juego (RESTAURADAS) ===
    "/api/game/adopt/{heroId}/{petId}": {
        post: { tags: ["Juego"], summary: "Tu héroe adopta una de tus mascotas", parameters: [ { name: "heroId", in: "path", required: true, schema: { type: "string" } }, { name: "petId", in: "path", required: true, schema: { type: "string" } } ], responses: { "200": { description: "Adopción exitosa" } } }
    },
    "/api/game/select/{petId}": { 
        post: { tags: ["Juego"], summary: "Selecciona una de tus mascotas para jugar", parameters: [{ name: "petId", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Mascota seleccionada" } } } 
    },
    "/api/game/deselect": { 
        post: { tags: ["Juego"], summary: "Deja de jugar con la mascota actual", responses: { "200": { description: "Sesión terminada" } } } 
    },
    "/api/game/status": { 
        get: { tags: ["Juego"], summary: "Consulta el estado de la mascota seleccionada", responses: { "200": { description: "Estado de la mascota" } } } 
    },
    "/api/game/feed": { 
        post: { tags: ["Juego"], summary: "Alimenta a la mascota seleccionada", responses: { "200": { description: "Mascota alimentada" } } } 
    },
    "/api/game/walk": { 
        post: { tags: ["Juego"], summary: "Saca a pasear a la mascota seleccionada", responses: { "200": { description: "Mascota paseada" } } } 
    },
    "/api/game/revive": { 
        post: { tags: ["Juego"], summary: "Revive a la mascota seleccionada (cuesta monedas)", responses: { "200": { description: "Mascota revivida" } } } 
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- RUTAS DE LA API ---
app.use('/api/auth', authController);
app.use('/api/heroes', heroController);
app.use('/api/pets', petController);
app.use('/api/game', gameController);

app.get('/', (req, res) => {
    res.send('API funcionando. Visita /api-docs para la documentación interactiva.');
});

app.listen(port, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:${port}`);
    console.log(`📚 Documentación disponible en http://localhost:${port}/api-docs`);
});