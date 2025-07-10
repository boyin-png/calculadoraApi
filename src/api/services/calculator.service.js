const getRectangleArea = (width, height) => {
  return width * height;
};

const getCubeVolume = (side) => {
  return Math.pow(side, 3);
};

const getCylinderVolume = (radius, height) => {
  return Math.PI * Math.pow(radius, 2) * height;
};

module.exports = {
  getRectangleArea,
  getCubeVolume,
  getCylinderVolume,
};