#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { generateTartan } = require('./generateTartan');

/**
 * Print usage instructions
 */
function printUsage() {
  console.log(`
Tartan SVG Generator
====================
Usage: node index.js <tartan-name> [size] [output-path]

Available tartans:
${fs.readdirSync('tartans').filter(f => !f.startsWith('_')).map(name => `  - ${name.replace('.json', '')}`).join('\n')}

Parameters:
  tartan-name  : Name of the tartan pattern to generate (required)
  size         : Size in pixels (optional)
  output-file  : Where to save the SVG file (optional, defaults to ./output/<tartan-name>.svg)

Examples:
  node index.js blackwatch
  node index.js blackwatch 1000
  node index.js blackwatch 2000 ./output/blackwatch2000.svg
  `);
}

/**
 * Main function to process CLI arguments and generate the selected tartan
 */
function main() {
  const args = process.argv.slice(2);

  // Show usage if no arguments or help requested
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printUsage();
    process.exit(0);
  }

  const tartanName = args[0].toLowerCase();
  const size = args[1] && !isNaN(parseInt(args[1])) ? parseInt(args[1]) : null;
  const output = args[2] || path.join(__dirname, 'output', `${tartanName}.svg`);;

  try {
    // Call the generator function
    generateTartan(tartanName, output, size, size);
    console.log(`Successfully generated tartan.`);
  } catch (error) {
    console.error(`Error generating tartan: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}
