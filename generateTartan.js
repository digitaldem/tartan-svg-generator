const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validateTartanConfig } = require('./validateTartanConfig');

/**
 * Generate the Black Watch tartan SVG pattern
 * @param {Object} tartan - Tartan configuration object or name of JSON config file
 * @param {number} repeat - Number of repeats of the tartan sett
 * @throws {Error} If tartan configuration is invalid
 */
async function generateTartan(tartan, repeat) {
  // Validate the required parameters
  const config = validateTartanConfig(tartan);
  const output = path.join(__dirname, 'output', `${tartan}_${repeat}x${repeat}`);

  // Extract the details from the config object
  const { name, colors, sett } = config;
  // Determine the size of the swatch
  const settSize = sett.reduce((sum, item) => sum + item.width, 0);
  console.log(`Generating ${name} tartan using ${settSize} sett at ${repeat}x${repeat}`);

  // Calculate the output size based on repeat factor
  const outputSize = (typeof repeat === 'number' && repeat > 0) ? settSize * repeat : settSize;

  // Generate the horizontal stripes
  let horizStripes = '';
  let y = 0;
  for (const item of sett) {
    const color = item.color.startsWith('#') ? item.color : colors[item.color];
    horizStripes += `<rect fill="${color}" height="${item.width}" width="100%" x="0" y="${y}"></rect>`;
    y += item.width;
  }

  // Generate the vertical stripes
  let vertStripes = '';
  let x = 0;
  for (const item of sett) {
    const color = item.color.startsWith('#') ? item.color : colors[item.color];
    vertStripes += `<rect fill="${color}" height="100%" width="${item.width}" x="${x}" y="0"></rect>`;
    x += item.width;
  }

  // Start building the SVG
  // Add defs section with pattern and mask
  // Add clipping to ensure we only show the requested dimensions
  // Begin the tartan group
  let svg = `<svg viewBox="0 0 ${outputSize} ${outputSize}" width="${outputSize}" height="${outputSize}" xmlns="http://www.w3.org/2000/svg">
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
    <rect x="0" y="0" width="${outputSize}" height="${outputSize}" />
  </clipPath>
  <g id="tartan" clip-path="url(#dimensionClip)">`;

  // Repeat horizontally and vertically to ensure full coverage
  for (let row = 0; row < repeat; row++) {
    for (let col = 0; col < repeat; col++) {
      svg +=
`
    <g transform="translate(${col * settSize}, ${row * settSize})">
      <g class="horizStripes">${horizStripes}</g>
      <g class="vertStripes" mask="url(#grating)">${vertStripes}</g>
    </g>
`;
    }
  }

  // Close the group and the SVG
  svg += `  </g>\n</svg>`;

  // Create PNG version
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  // Write to SVG file
  const outputSvg = `${output}.svg`;
  await fs.promises.writeFile(outputSvg, svg);
  console.log(`${name} SVG generated at ${outputSvg} (${outputSize}x${outputSize})`);

  // Write to PNG file
  const outputPng = `${output}.png`;
  await fs.promises.writeFile(outputPng, png);
  console.log(`${name} PNG generated at ${outputPng} (${outputSize}x${outputSize})`);

  return true;
}

// Export for use as a module
module.exports = { generateTartan };
