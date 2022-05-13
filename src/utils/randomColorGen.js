const { rando, randoSequence } = require("@nastyox/rando.js");
const defaultColors = [
  "#FFC9B9",
  "#B1E3D1",
  "#F6979F",
  "#FFE886",
  "#D1CFE2",
  "#7EC4CF",
];
module.exports  = getRandomColor = (colorsArray = defaultColors) => {
  const randomColor = rando(colorsArray).value;
  return randomColor;
};
