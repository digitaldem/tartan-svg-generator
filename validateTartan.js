const fs = require('fs');
const path = require('path');

/**
 * Validate tartan configuration object
 * @param {Object} config - Tartan configuration to validate
 * @throws {Error} If configuration is invalid
 */
function validateTartan(config) {
  // Load configuration if it's a string otherwise just use the object as-is
  const tartan = (typeof config === 'string') ? _loadConfig(config) : config;

  // Ensure the tartan config is an object
  if (typeof tartan !== 'object' || tartan === null) {
    throw new Error('Tartan configuration must be an object');
  }

  // Validate required fields
  _validateRequiredFields(tartan);

  return tartan;
}

function _loadConfig(name) {
  const configPath = name.endsWith('.json') ? name : path.join(__dirname, 'tartans', `${name}.json`);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Tartan configuration not found: ${configPath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    throw new Error(`Invalid JSON configuration: ${err.message}`);
  }
}

function _validateRequiredFields(tartan) {
  // Validate name
  if (!tartan.name) {
    throw new Error('Tartan configuration missing required field: name');
  }

  // Validate colors
  if (!tartan.colors || Object.keys(tartan.colors).length === 0) {
    throw new Error('Tartan configuration missing required field: colors');
  }
  for (const color of Object.values(tartan.colors)) {
    _validateColor(color);
  }

  // Validate sequences
  if (!tartan.sequences || !Array.isArray(tartan.sequences) || tartan.sequences.length === 0) {
    throw new Error('Tartan configuration missing required field: sequence (must be a non-empty array)');
  }
  for (const sequence of tartan.sequences) {
    _validateSequence(sequence);
  }
}

function _validateColor(color) {
  // Validate the data type
  if (typeof color !== 'string') {
    throw new Error(`A color has invalid value: ${color}`);
  }

  // Validate valid hex color format (#RRGGBB)
  if (!/^#[0-9A-F]{6}$/i.test(color)) {
    throw new Error(`A color has invalid hex format: ${color}`);
  }
}

function _validateSequence(sequence) {
  // Validate the data type
  if (typeof sequence !== 'object' || sequence === null) {
    throw new Error(`Invalid sequence item: ${JSON.stringify(sequence)}`);
  }

  // Validate sequence item has width and color
  const { width, color } = sequence;
  if (typeof width !== 'number' || width <= 0) {
    throw new Error(`Invalid width in sequence item: ${JSON.stringify(sequence)}`);
  }
  if (typeof color !== 'string' || color.trim() === '') {
    throw new Error(`Invalid color in sequence item: ${JSON.stringify(sequence)}`);
  }
}

// Export
module.exports = { validateTartan };
