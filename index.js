const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const calculatorRoutes = require('./src/api/routes/calculator.routes.js');

const app = express();
const port = 3000;

// Middleware para que Express entienda JSON
app.use(express.json());

// --- Configuración de Swagger ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Cálculos Geométricos',
      version: '1.0.0',
      description: 'Una simple API para calcular áreas y volúmenes.',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./src/api/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Rutas de la API ---
app.use('/api/calculator', calculatorRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación de Swagger disponible en http://localhost:${port}/api-docs`);
});