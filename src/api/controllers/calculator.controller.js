const calculatorService = require('../../services/calculator.service.js'); // <-- CONFIGURACIÓN

const calculateRectangleArea = (req, res) => {
  const { width, height } = req.body;
  res.json({ result: calculatorService.getRectangleArea(width, height) });
};

const calculateCubeVolume = (req, res) => {
  const { side } = req.body;
  res.json({ result: calculatorService.getCubeVolume(side) });
};

const calculateCylinderVolume = (req, res) => {
  const { radius, height } = req.body;
  res.json({ result: calculatorService.getCylinderVolume(radius, height) });
};

module.exports = {
  calculateRectangleArea,
  calculateCubeVolume,
  calculateCylinderVolume,
};