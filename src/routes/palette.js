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

// Dark Colors
/* Dark Palette https://coolors.co/101010-1f1f1f-313131-393b40-394356-2f4369 */
const Night = '#101010';
const EerieBlack = '#1F1F1F';
const Jet = '#313131';
const Onyx = '#393B40';
const Charcoal = '#394356';

/**
 * @param {string} color
 * @param {number} opacity
 */
function opacity(color, opacity) {
  let finalColor = color + Math.round(255 * (opacity/100)).toString(16);
  return finalColor;
}

const newPalette = {
  "light": 
    {"main": [
        {"blue": VioletBlue},
        {"blue-light": CarolinaBlue},
        {"blue-alt": GlaucousBlue}
      ], 
      "logo": [
        {"blue": YaleBlue}
      ],
      "red": [
        {"": EngineeringOrange}
      ], 
      "green": [
        {"": DarkSpringGreen}
       ], 
      "contrast": [
        {"purple": Plum},
        {"text-light": Black},
        {"text-dark": White}
      ], 
      "neutral": [
        {"white": White},
        {"brown": VanDykeBrown},
        {"gray": AntiFlashWhite},
        {"gray-op-50": opacity(AntiFlashWhite, 50)},
        {"gray-op-10": opacity(AntiFlashWhite, 10)}
      ]
    }
  }

export const palette = {
  "light": [
    {varName: '--main-blue', color: VioletBlue}, 
    {varName: '--main-blue-light', color: CarolinaBlue},
    {varName: '--main-blue-alt', color: GlaucousBlue}, 
    {varName: '--logo-blue', color: YaleBlue}, 
    {varName: '--red', color: EngineeringOrange}, 
    {varName: '--green', color: DarkSpringGreen}, 
    {varName: '--contrast-purple', color: Plum}, 
    {varName: '--neutral-white', color: White}, 
    {varName: '--neutral-gray', color: AntiFlashWhite}, 
    {varName: '--neutral-brown', color: VanDykeBrown}, 
    {varName: '--neutral-gray-op-50', color: opacity(AntiFlashWhite, 50)}, 
    {varName: '--neutral-gray-op-10', color: opacity(AntiFlashWhite, 10)}, 
    {varName: '--contrast-text-light', color: Black}, 
    {varName: '--contrast-text-dark', color: White}, 
  ],
  "dark": [
    {varName: '--main-blue', color: CarolinaBlue}, 
    {varName: '--main-blue-light', color: VioletBlue},
    {varName: '--main-blue-alt', color: GlaucousBlue}, 
    {varName: '--logo-blue', color: YaleBlue}, 
    {varName: '--red', color: EngineeringOrange}, 
    {varName: '--green', color: DarkSpringGreen}, 
    {varName: '--contrast-purple', color: SteelPink}, 
    {varName: '--neutral-white', color: Black}, 
    {varName: '--neutral-gray', color: Night}, 
    {varName: '--neutral-brown', color: VanDykeBrown}, 
    {varName: '--neutral-gray-op-50', color: opacity(Night, 50)},
    {varName: '--neutral-gray-op-10', color: opacity(Night, 10)}, 
    {varName: '--contrast-text-light', color: White}, 
    {varName: '--contrast-text-dark', color: Black}, 
  ],
}
