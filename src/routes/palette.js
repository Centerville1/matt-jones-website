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
const Onyx = '#2D2F34';
const Charcoal = '#394356';

// Gray Colors
/* Gray Palette - neutral gray tones */
const LightGray = '#E0E0E0';
const BackgroundGray = '#3D3D3D'; // Lightened from #2A2A2A (about 1/3 toward white)
const MediumGray = '#999999';
const DarkGray = '#333333';
const SlateBlueGray = '#8BA5C8'; // Light blue-gray (brighter)
const SteelBlueGray = '#6B86AB'; // Medium blue-gray (brighter)
const GraphiteBlueGray = '#4F6482'; // Dark blue-gray (brighter)

// Sepia Colors
/* Sepia Palette - warm vintage tones https://coolors.co/f4e8d8-d4a574-8b6914-704214-3d2817 */
const Parchment = '#F4E8D8';
const BurlyWood = '#D4A574';
const DarkGoldenrod = '#8B6914';
const SaddleBrown = '#704214';
const DarkBrown = '#3D2817';
const WarmCream = '#FBF5ED';
const RustyBrown = '#A0522D';
const VintageGold = '#B8860B';

// Ocean Colors
/* Ocean Palette - deep sea blues and aqua tones https://coolors.co/003d5b-30bced-7fb285-e8f1f5-00171f */
const DeepBlue = '#003D5B';
const AquaMarine = '#30BCED';
const SeafoamGreen = '#7FB285';
const FoamWhite = '#E8F1F5';
const AbyssBlack = '#00171F';
const TealBlue = '#006D77';
const LightCyan = '#83C5BE';

const Clear = '#00000000';

/**
 * Opacity filter for HEX colors
 * @param {string} color the color to add opacity to
 * @param {number} opacity percent opacity for the new color
 *
 * @returns {string} resulting color with opacity value
 */
function opacity(color, opacity) {
  return color + Math.round(255 * (opacity / 100)).toString(16);
}

// Colors that don't change between light and dark modes
const constantColors = [
  { varName: '--constant-white', color: White },
  { varName: '--constant-black', color: Black },
  { varName: '--logo-blue', color: YaleBlue },
  { varName: '--red', color: EngineeringOrange },
  { varName: '--green', color: DarkSpringGreen },
  { varName: '--neutral-brown', color: VanDykeBrown },
  { varName: '--no-background', color: Clear },
];

// Colors specific to light mode
const lightScheme = [
  { varName: '--main-blue', color: VioletBlue },
  { varName: '--main-blue-light', color: CarolinaBlue },
  { varName: '--main-blue-alt', color: GlaucousBlue },
  { varName: '--contrast-purple', color: Plum },
  { varName: '--neutral-white', color: White },
  { varName: '--neutral-black', color: Night },
  { varName: '--neutral-gray', color: AntiFlashWhite },
  { varName: '--neutral-gray-op-50', color: opacity(AntiFlashWhite, 50) },
  { varName: '--neutral-gray-op-10', color: opacity(AntiFlashWhite, 10) },
  { varName: '--neutral-dark-gray', color: Timberwolf },
  { varName: '--neutral-dark-gray-op-50', color: opacity(Timberwolf, 50) },
  { varName: '--neutral-dark-gray-op-10', color: opacity(Timberwolf, 10) },
  { varName: '--contrast-text-light', color: Black },
  { varName: '--contrast-text-dark', color: White },
];

// Colors specific to dark mode
const darkScheme = [
  { varName: '--main-blue', color: CarolinaBlue },
  { varName: '--main-blue-light', color: VioletBlue },
  { varName: '--main-blue-alt', color: Charcoal },
  { varName: '--contrast-purple', color: SteelPink },
  { varName: '--neutral-white', color: Night },
  { varName: '--neutral-black', color: White },
  { varName: '--neutral-gray', color: EerieBlack },
  { varName: '--neutral-gray-op-50', color: opacity(EerieBlack, 50) },
  { varName: '--neutral-gray-op-10', color: opacity(EerieBlack, 10) },
  { varName: '--neutral-dark-gray', color: Onyx },
  { varName: '--neutral-dark-gray-op-50', color: opacity(Onyx, 50) },
  { varName: '--neutral-dark-gray-op-10', color: opacity(Onyx, 10) },
  { varName: '--contrast-text-light', color: White },
  { varName: '--contrast-text-dark', color: Black },
];

// Colors specific to sepia mode
const sepiaScheme = [
  { varName: '--main-blue', color: RustyBrown },
  { varName: '--main-blue-light', color: VintageGold },
  { varName: '--main-blue-alt', color: BurlyWood },
  { varName: '--contrast-purple', color: DarkGoldenrod },
  { varName: '--neutral-white', color: WarmCream },
  { varName: '--neutral-black', color: DarkBrown },
  { varName: '--neutral-gray', color: Parchment },
  { varName: '--neutral-gray-op-50', color: opacity(Parchment, 50) },
  { varName: '--neutral-gray-op-10', color: opacity(Parchment, 10) },
  { varName: '--neutral-dark-gray', color: BurlyWood },
  { varName: '--neutral-dark-gray-op-50', color: opacity(BurlyWood, 50) },
  { varName: '--neutral-dark-gray-op-10', color: opacity(BurlyWood, 10) },
  { varName: '--contrast-text-light', color: SaddleBrown },
  { varName: '--contrast-text-dark', color: WarmCream },
];

// Colors specific to ocean mode
const oceanScheme = [
  { varName: '--main-blue', color: TealBlue },
  { varName: '--main-blue-light', color: AquaMarine },
  { varName: '--main-blue-alt', color: LightCyan },
  { varName: '--contrast-purple', color: SeafoamGreen },
  { varName: '--neutral-white', color: FoamWhite },
  { varName: '--neutral-black', color: AbyssBlack },
  { varName: '--neutral-gray', color: LightCyan },
  { varName: '--neutral-gray-op-50', color: opacity(LightCyan, 50) },
  { varName: '--neutral-gray-op-10', color: opacity(LightCyan, 10) },
  { varName: '--neutral-dark-gray', color: TealBlue },
  { varName: '--neutral-dark-gray-op-50', color: opacity(TealBlue, 50) },
  { varName: '--neutral-dark-gray-op-10', color: opacity(TealBlue, 10) },
  { varName: '--contrast-text-light', color: DeepBlue },
  { varName: '--contrast-text-dark', color: FoamWhite },
];

// Colors specific to gray mode
const grayScheme = [
  { varName: '--main-blue', color: SlateBlueGray },
  { varName: '--main-blue-light', color: SteelBlueGray },
  { varName: '--main-blue-alt', color: GraphiteBlueGray },
  { varName: '--contrast-purple', color: GraphiteBlueGray },
  { varName: '--neutral-white', color: BackgroundGray },
  { varName: '--neutral-black', color: LightGray },
  { varName: '--neutral-gray', color: DarkGray },
  { varName: '--neutral-gray-op-50', color: opacity(DarkGray, 50) },
  { varName: '--neutral-gray-op-10', color: opacity(DarkGray, 10) },
  { varName: '--neutral-dark-gray', color: GraphiteBlueGray },
  { varName: '--neutral-dark-gray-op-50', color: opacity(GraphiteBlueGray, 50) },
  { varName: '--neutral-dark-gray-op-10', color: opacity(GraphiteBlueGray, 10) },
  { varName: '--contrast-text-light', color: LightGray },
  { varName: '--contrast-text-dark', color: DarkGray },
];

// Return the full theme JSON with all palettes (dark first as default, then gray, light, sepia, and ocean)
export const createPalette = () => {
  return {
    dark: {
      colors: darkScheme.concat(constantColors),
      icon: '🌙',
      name: 'Dark',
    },
    gray: {
      colors: grayScheme.concat(constantColors),
      icon: '⚪',
      name: 'Gray',
    },
    light: {
      colors: lightScheme.concat(constantColors),
      icon: '☀️',
      name: 'Light',
    },
    sepia: {
      colors: sepiaScheme.concat(constantColors),
      icon: '📜',
      name: 'Sepia',
    },
    ocean: {
      colors: oceanScheme.concat(constantColors),
      icon: '🌊',
      name: 'Ocean',
    },
  };
};
