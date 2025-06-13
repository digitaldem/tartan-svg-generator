#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const { generateTartan } = require('./generateTartan');

/**
 * Print usage instructions
 */
function printUsage() {
  console.log(`
Tartan SVG Generator
====================
Usage: node index.js <tartan> [-r repeat]

Available tartans:
${fs.readdirSync('tartans').filter(f => !f.startsWith('_')).map(name => `  - ${name.replace('.json', '')}`).join('\n')}

Parameters:
  tartan : Name of the tartan to generate (required)
  repeat : Number of repeats of the sett (optional, defaults to 1)

Examples:
  node index.js blackwatch
  node index.js blackwatch -r 2
  `);
}

/**
 * Main function to process CLI arguments and generate the selected tartan
 */
async function main() {
  const args = minimist(process.argv.slice(2), {
    alias: {
      r: 'repeat',
      h: 'help'
    }
  });

  // Show usage if no arguments or help requested
  if (args.help || args._.length === 0) {
    printUsage();
    process.exit(0);
  }

  const tartan = args._[0]?.toLowerCase();
  if (tartan == null || tartan.trim() === '') {
    console.error('Tartan name not provided.');
    process.exit(1);
  }

  const repeat = parseInt(args.repeat || '1', 10);
  if (isNaN(repeat) || repeat < 1) {
    console.error('Repeat must be a positive integer.');
    process.exit(1);
  }

  try {
    // Call the generator function
    const success = await generateTartan(tartan, repeat);
    if (success) {
      console.log(`Successfully generated tartan.`);
      process.exit(0);
    }
    throw new Error('Tartan generation failed with unspecified error.');
  } catch (error) {
    console.error(`Error generating tartan: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}
