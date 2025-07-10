const express = require('express');
const swaggerUi = require('swagger-ui-express');
const calculatorRoutes = require('./src/api/routes/calculator.routes.js');

const app = express();
const port = 3000;

app.use(express.json());

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Mi Web API de Cálculos',
    version: '1.0.0',
    description: 'Panel de control interactivo para probar las operaciones de la API.',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Servidor Local'
    }
  ],
  tags: [
    {
      name: 'Operaciones de Cálculo',
      description: 'Endpoints para realizar los cálculos geométricos'
    }
  ],
  paths: {
    "/api/calculator/rectangle/area": {
      post: {
        tags: ["Operaciones de Cálculo"],
        summary: "Calcula el área de un rectángulo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  width: { type: "number", example: 10 },
                  height: { type: "number", example: 5 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Resultado exitoso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    result: { type: "number", example: 50 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/calculator/cube/volume": {
      post: {
        tags: ["Operaciones de Cálculo"],
        summary: "Calcula el volumen de un cubo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  side: { type: "number", example: 4 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Resultado exitoso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    result: { type: "number", example: 64 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/calculator/cylinder/volume": {
      post: {
        tags: ["Operaciones de Cálculo"],
        summary: "Calcula el volumen de un cilindro",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  radius: { type: "number", example: 3 },
                  height: { type: "number", example: 10 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Resultado exitoso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    result: { type: "number", example: 282.74 }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/calculator', calculatorRoutes);


app.listen(port, () => {
  console.log(`✅ ¡Servidor funcionando!`);
  console.log(`🚀 Panel de control principal disponible en: http://localhost:3000`);
});