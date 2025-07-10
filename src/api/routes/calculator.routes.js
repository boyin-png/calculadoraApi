const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculator.controller.js');

router.post('/rectangle/area', calculatorController.calculateRectangleArea);
router.post('/cube/volume', calculatorController.calculateCubeVolume);
router.post('/cylinder/volume', calculatorController.calculateCylinderVolume);

module.exports = router;