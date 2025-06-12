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
Usage: node index.js <tartan-sett> [-o output-path] [-r repeat]

Available tartans:
${fs.readdirSync('tartans').filter(f => !f.startsWith('_')).map(name => `  - ${name.replace('.json', '')}`).join('\n')}

Parameters:
  tartan-sett : Name of the tartan sett (pattern) to generate (required)
  output-file : Where to save the SVG file (optional, defaults to ./output/<tartan-sett>.svg)
  repeat      : Number of repeats of the sett (optional, defaults to 1)

Examples:
  node index.js blackwatch
  node index.js blackwatch -o ./output/blackwatch.svg
  node index.js blackwatch -r 2
  node index.js blackwatch -o ./output/blackwatch_2x2.svg -r 2
  `);
}

/**
 * Main function to process CLI arguments and generate the selected tartan
 */
async function main() {
  const args = minimist(process.argv.slice(2), {
    alias: {
      o: 'output',
      r: 'repeat',
      h: 'help'
    }
  });

  if (args.help || args._.length === 0) {
    printUsage();
    process.exit(0);
  }

  // Show usage if no arguments or help requested
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printUsage();
    process.exit(0);
  }

  const tartanSett = args._[0]?.toLowerCase();
  const output = args.output || path.join(__dirname, 'output', `${tartanSett}.svg`);
  const repeat = parseInt(args.repeat || '1', 10);

  if (isNaN(repeat) || repeat < 1) {
    console.error('Repeat must be a positive integer.');
    process.exit(1);
  }

  try {
    // Call the generator function
    const success = await generateTartan(tartanSett, output, repeat);
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
