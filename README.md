# Tartan SVG Generator

A Node.js utility to generate SVG representations of various tartan patterns.

## Features

- Generate precise SVG representations of traditional tartan patterns
- Command-line interface with multiple tartan options
- Extensible architecture for adding new tartans

## Installation

```bash
# Clone the repository
git clone https://github.com/digitaldem/tartan-svg-generator.git
cd tartan-svg-generator

# Install dependencies
npm install
```

## Usage

### As a command-line tool

```bash
# Basic usage
node index.js <tartan-name> [size] [output-file]

# Examples
node index.js blackwatch
node index.js blackwatch 1000
node index.js blackwatch 2000 ./output/blackwatch2000.svg

```

### Using npm scripts

```bash
# Generate Black Watch tartan
npm run blackwatch

```

## Currently Available Tartans

- **Black Watch** - Navy blue and hunter green of the Black Watch tartan
  - [Tartan Registry](https://www.tartanregister.gov.uk/tartanDetails?ref=5376)
- **Black Watch (Ground)** - Monochromatic black and white version of the Black Watch tartan
  - [Tartan Registry](https://www.tartanregister.gov.uk/tartanDetails?ref=282)
- **Black Watch (Hunting)** - Government variant of the navy blue and hunter green of the Black Watch tartan
  - [Tartan Registry](https://www.tartanregister.gov.uk/tartanDetails?ref=277)
- **Macpherson** - Traditional red, blue, green, yellow and black tartan
  - [Tartan Registry](https://www.tartanregister.gov.uk/tartanDetails?ref=2707)
- **Royal Stewart** - Classic red-dominant tartan with green sections
  - [Tartan Registry](https://www.tartanregister.gov.uk/tartanDetails?ref=3958)
- **Royal Stuart** - Classic red dominant tartan with blue, black, yellow and white
  - [Tartan Registry](https://www.tartanregister.gov.uk/tartanDetails?ref=3612)



## Adding New Tartans

1. Copy the `_tartan-template.json` file inside the `tartans` directory to define a new tartan configuration
2. Rename it to `<tartanname>.json`
3. Set the Name, Description and the Tartan Registry Link values
4. Define your color palette and stripe sequences
5. Add to `scripts` section in `package.json` (Optional)


## License

MIT

## Contributing

Contributions welcome. Please feel free to submit a Pull Request.
