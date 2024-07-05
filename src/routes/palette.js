// Primary palette colors:
/* Color Palette https://coolors.co/4859a8-8bbcda-3f3631-c41717-227c40 */
const VioletBlue = '#4859A8';
const CarolinaBlue = '#8BBCDA';
const VanDykeBrown = '#3F3631';
const EngineeringOrange = '#C41717';
const DarkSpringGreen = '#227C40';

// Other colors:
const Plum = '#943892';
const SteelPink = '#C754C5';
const GlaucousBlue = '#5D7FBA';
const YaleBlue = '#2f4369';

// Neutral colors:
const White = '#ffffff';
const Black = '#000000';
const AntiFlashWhite = '#EFEFEF';
const Timberwolf = '#D8D8D8';

// Dark Colors
/* Dark Palette https://coolors.co/101010-1f1f1f-313131-393b40-394356-2f4369 */
const Night = '#101010';
const EerieBlack = '#1F1F1F';
// const Jet = '#313131';
const Onyx = '#393B40';
const Charcoal = '#394356';

const Clear = '#00000000';

/**
 * Opacity filter for HEX colors
 * @param {string} color the color to add opacity to
 * @param {number} opacity percent opacity for the new color
 * 
 * @returns {string} resulting color with opacity value
 */
function opacity(color, opacity) {
  return color + Math.round(255 * (opacity/100)).toString(16);
}

// Colors that don't change between light and dark modes
const constantColors = [
  {varName: '--constant-white', color: White}, 
  {varName: '--constant-black', color: Black}, 
  {varName: '--logo-blue', color: YaleBlue}, 
  {varName: '--red', color: EngineeringOrange},
  {varName: '--green', color: DarkSpringGreen},
  {varName: '--neutral-brown', color: VanDykeBrown}, 
  {varName: '--no-background', color: Clear}
]

// Colors specific to light mode
const lightScheme = [
  {varName: '--main-blue', color: VioletBlue}, 
  {varName: '--main-blue-light', color: CarolinaBlue},
  {varName: '--main-blue-alt', color: GlaucousBlue}, 
  {varName: '--contrast-purple', color: Plum}, 
  {varName: '--neutral-white', color: White},
  {varName: '--neutral-black', color: Night}, 
  {varName: '--neutral-gray', color: AntiFlashWhite}, 
  {varName: '--neutral-gray-op-50', color: opacity(AntiFlashWhite, 50)}, 
  {varName: '--neutral-gray-op-10', color: opacity(AntiFlashWhite, 10)}, 
  {varName: '--neutral-dark-gray', color: Timberwolf},
  {varName: '--neutral-dark-gray-op-50', color: opacity(Timberwolf, 50)},
  {varName: '--neutral-dark-gray-op-10', color: opacity(Timberwolf, 10)},
  {varName: '--contrast-text-light', color: Black}, 
  {varName: '--contrast-text-dark', color: White}
];

// Colors specific to dark mode
const darkScheme = [
  {varName: '--main-blue', color: CarolinaBlue},
  {varName: '--main-blue-light', color: VioletBlue},
  {varName: '--main-blue-alt', color: Charcoal},
  {varName: '--contrast-purple', color: SteelPink},
  {varName: '--neutral-white', color: Night},
  {varName: '--neutral-black', color: White},
  {varName: '--neutral-gray', color: EerieBlack},
  {varName: '--neutral-gray-op-50', color: opacity(EerieBlack, 50)},
  {varName: '--neutral-gray-op-10', color: opacity(EerieBlack, 10)},
  {varName: '--neutral-dark-gray', color: Onyx},
  {varName: '--neutral-dark-gray-op-50', color: opacity(Onyx, 50)},
  {varName: '--neutral-dark-gray-op-10', color: opacity(Onyx, 10)},
  {varName: '--contrast-text-light', color: White},
  {varName: '--contrast-text-dark', color: Black}
];

// Return the full theme JSON, with light and dark palettes included
export const createPalette = () => {
  return {'light': lightScheme.concat(constantColors), 
  'dark': darkScheme.concat(constantColors)};
}