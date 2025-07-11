import express from 'express';
import swaggerUi from 'swagger-ui-express';

// Importamos AMBOS controladores
import heroController from './controllers/heroController.js';
import petController from './controllers/petController.js';

const app = express();
const port = 3001;

app.use(express.json());

// --- CONFIGURACIÓN DE SWAGGER COMPLETA Y SEPARADA ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API de Plataforma Musical',
    version: '1.0.0',
    description: 'Gestiona Músicos/Artistas (Héroes) y sus Samples/Instrumentos (Mascotas).',
  },
  servers: [{ url: `http://localhost:${port}` }],
  // 1. Definimos las DOS secciones que queremos
  tags: [
    {
      name: 'Heroes',
      description: 'Operaciones relacionadas con los Músicos/Artistas.'
    },
    {
      name: 'Mascotas',
      description: 'Operaciones para gestionar los Samples/Instrumentos.'
    }
  ],
  // 2. Definimos TODAS las rutas y las asignamos a su etiqueta (tag)
  paths: {
    // --- Rutas de Héroes ---
    "/api/heroes": {
      get: {
        tags: ["Heroes"],
        summary: "Obtiene la lista de todos los héroes",
        responses: { "200": { description: "OK" } }
      },
      post: {
        tags: ["Heroes"],
        summary: "Crea un nuevo héroe",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: '#/components/schemas/HeroInput' } } }
        },
        responses: { "201": { description: "Creado" } }
      }
    },
    "/api/heroes/{id}": {
      put: {
        tags: ["Heroes"],
        summary: "Actualiza un héroe existente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: '#/components/schemas/HeroInput' } } }
        },
        responses: { "200": { description: "Actualizado" } }
      },
      delete: {
        tags: ["Heroes"],
        summary: "Elimina un héroe por su ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" } }
      }
    },
    // --- Rutas de Mascotas ---
    "/api/pets": {
      get: {
        tags: ["Mascotas"],
        summary: "Obtiene la lista de todas las mascotas",
        responses: { "200": { description: "OK" } }
      },
      post: {
        tags: ["Mascotas"],
        summary: "Crea una nueva mascota",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: '#/components/schemas/PetInput' } } }
        },
        responses: { "201": { description: "Creada" } }
      }
    },
    "/api/pets/{id}": {
      put: {
        tags: ["Mascotas"],
        summary: "Actualiza una mascota",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: '#/components/schemas/PetInput' } } }
        },
        responses: { "200": { description: "Actualizada" } }
      },
      delete: {
        tags: ["Mascotas"],
        summary: "Da de alta a una mascota por su ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" } }
      }
    }
  },
  // 3. Definimos los "moldes" de datos para los cuerpos de las peticiones
  components: {
    schemas: {
      HeroInput: {
        type: "object",
        properties: {
          name: { type: "string", example: "Daft Punk" },
          power: { type: "string", example: "French House" },
          age: { type: "integer", example: 31 },
          city: { type: "string", example: "Paris" }
        }
      },
      PetInput: {
        type: "object",
        properties: {
          name: { type: "string", example: "TR-808 Kick" },
          animal: { type: "string", example: "Drum Sample" },
          superpower: { type: "string", example: "Deep Bass" }
        }
      }
    }
  }
};

// Le decimos a Swagger que use nuestro objeto de configuración en la ruta "/api-docs"
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Le decimos a la app que use AMBOS controladores de rutas
app.use('/api', heroController);
app.use('/api', petController);

app.listen(port, () => {
    console.log(`✅ Servidor funcionando en http://localhost:${port}`);
    console.log(`📚 Documentación disponible en http://localhost:${port}/api-docs`);
});