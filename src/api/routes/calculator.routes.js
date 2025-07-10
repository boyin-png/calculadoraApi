const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculator.controller.js');

/**
 * @swagger
 * tags:
 * name: Calculations
 * description: Endpoints para cálculos geométricos
 */

/**
 * @swagger
 * /api/calculator/rectangle/area:
 * post:
 * summary: Calcula el área de un rectángulo
 * tags: [Calculations]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * width:
 * type: number
 * example: 10
 * height:
 * type: number
 * example: 5
 * responses:
 * 200:
 * description: El área calculada.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * result:
 * type: number
 * example: 50
 */
router.post('/rectangle/area', calculatorController.calculateRectangleArea);

/**
 * @swagger
 * /api/calculator/cube/volume:
 * post:
 * summary: Calcula el volumen de un cubo
 * tags: [Calculations]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * side:
 * type: number
 * example: 4
 * responses:
 * 200:
 * description: El volumen calculado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * result:
 * type: number
 * example: 64
 */
router.post('/cube/volume', calculatorController.calculateCubeVolume);

/**
 * @swagger
 * /api/calculator/cylinder/volume:
 * post:
 * summary: Calcula el volumen de un cilindro
 * tags: [Calculations]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * radius:
 * type: number
 * example: 3
 * height:
 * type: number
 * example: 10
 * responses:
 * 200:
 * description: El volumen calculado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * result:
 * type: number
 * example: 282.7433388230814
 */
router.post('/cylinder/volume', calculatorController.calculateCylinderVolume);

module.exports = router;