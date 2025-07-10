const calculatorService = require('areavolP3/src/api/services/calculator.service.js');

const calculateRectangleArea = (req, res) => {
  const { width, height } = req.body;
  if (typeof width !== 'number' || typeof height !== 'number') {
    return res.status(400).json({ error: 'Parámetros "width" y "height" deben ser números.' });
  }
  const area = calculatorService.getRectangleArea(width, height);
  res.json({ result: area });
};

const calculateCubeVolume = (req, res) => {
  const { side } = req.body;
  if (typeof side !== 'number') {
    return res.status(400).json({ error: 'Parámetro "side" debe ser un número.' });
  }
  const volume = calculatorService.getCubeVolume(side);
  res.json({ result: volume });
};

const calculateCylinderVolume = (req, res) => {
  const { radius, height } = req.body;
  if (typeof radius !== 'number' || typeof height !== 'number') {
    return res.status(400).json({ error: 'Parámetros "radius" y "height" deben ser números.' });
  }
  const volume = calculatorService.getCylinderVolume(radius, height);
  res.json({ result: volume });
};

module.exports = {
  calculateRectangleArea,
  calculateCubeVolume,
  calculateCylinderVolume,
};