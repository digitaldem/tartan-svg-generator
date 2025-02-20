const fs = require('fs');
const path = require('path');

/**
 * Validate that output parameter is a valid file path
 * @param {*} output - The output parameter to validate
 * @throws {Error} If output is not a valid file path
 */
function validateOutput(output) {
  // Skip validation if output is not provided
  if (output === undefined || output === null || typeof output !== 'string' || output.trim() === '') {
    throw new Error('Output path is required');
  }

  // Check for invalid characters in path (Just a basic check)
  const invalidChars = /[<>:"|?*\x00-\x1F]/g;
  if (invalidChars.test(output)) {
    throw new Error(`Output path contains invalid characters: ${output}`);
  }

  try {
    // Check that directory part is valid
    const dir = path.dirname(output);
    path.parse(dir);

    // Ensure the file extension (should be .svg)
    return (output.toLowerCase().endsWith('.svg') ? output : `${output}.svg`);
  } catch (err) {
    throw new Error(`Invalid output directory: ${err.message}`);
  }
}

module.exports = { validateOutput };
