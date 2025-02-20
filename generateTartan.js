const fs = require('fs');
const path = require('path');
const { validateTartan } = require('./validateTartan');
const { validateOutput } = require('./validateOutput');

/**
 * Generate the Black Watch tartan SVG pattern
 * @param {Object} tartan - Tartan configuration object or name of JSON config file
 * @param {string} output - Output file to save the SVG file
 * @param {number} [width] - Optional specific width
 * @param {number} [height] - Optional specific height (if different from width)
 * @throws {Error} If tartan configuration is invalid
 */
function generateTartan(tartan, output, width, height) {
  // Validate the required parameters
  const config = validateTartan(tartan);
  const outFile = validateOutput(output);

  // Extract the details from the config object
  const { name, colors, sequences } = config;
  // Determine the size of the swatch
  const swatchSize = sequences.reduce((sum, item) => sum + item.width, 0);

  // Determine the width and height
  const outWidth = (typeof width === 'number' && width > 0) ? Math.floor(width) : swatchSize;
  const outHeight = (typeof height === 'number' && height > 0) ? Math.floor(height) : outWidth;

  // Calculate number of repeats needed (add 1 to ensure full coverage including partial tiles)
  const repeatX = Math.ceil(outWidth / swatchSize) + (outWidth % swatchSize === 0 ? 0 : 1);
  const repeatY = Math.ceil(outHeight / swatchSize) + (outHeight % swatchSize === 0 ? 0 : 1);

  // Generate the horizontal stripes
  let horizStripes = '';
  let y = 0;
  for (const item of sequences) {
    const color = item.color.startsWith('#') ? item.color : colors[item.color];
    horizStripes += `<rect fill="${color}" height="${item.width}" width="100%" x="0" y="${y}"></rect>`;
    y += item.width;
  }

  // Generate the vertical stripes
  let vertStripes = '';
  let x = 0;
  for (const item of sequences) {
    const color = item.color.startsWith('#') ? item.color : colors[item.color];
    vertStripes += `<rect fill="${color}" height="100%" width="${item.width}" x="${x}" y="0"></rect>`;
    x += item.width;
  }

  // Start building the SVG
  // Add defs section with pattern and mask
  // Add clipping to ensure we only show the requested dimensions
  // Begin the tartan group
  let svg = `<svg viewBox="0 0 ${outWidth} ${outHeight}" width="${outWidth}" height="${outHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
      <polygon points="0,4 0,8 8,0 4,0" fill="#ffffff"></polygon>
      <polygon points="4,8 8,8 8,4" fill="#ffffff"></polygon>
    </pattern>
    <mask id="grating" x="0" y="0" width="1" height="1">
      <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)"></rect>
    </mask>
  </defs>
  <clipPath id="dimensionClip">
    <rect x="0" y="0" width="${outWidth}" height="${outHeight}" />
  </clipPath>
  <g id="tartan" clip-path="url(#dimensionClip)">`;

  // Repeat horizontally and vertically to ensure full coverage
  for (let row = 0; row < repeatY; row++) {
    for (let col = 0; col < repeatX; col++) {
      svg +=
`
    <g transform="translate(${col * swatchSize}, ${row * swatchSize})">
      <g class="horizStripes">${horizStripes}</g>
      <g class="vertStripes" mask="url(#grating)">${vertStripes}</g>
    </g>
`;
    }
  }

  // Close the group and the SVG
  svg += `  </g>\n</svg>`;

  // Write to file
  fs.writeFileSync(outFile, svg);
  console.log(`${name} SVG generated at ${outFile} (${outWidth}x${outHeight})`);

  return svg;
}

// Export for use as a module
module.exports = { generateTartan };
