// This is a CommonJS script for obfuscation
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Files to obfuscate (focusing on the core algorithm files)
const filesToObfuscate = [
  'client/src/lib/OrbitXniner.ts',
  'client/src/lib/WLQuantumBTree.ts',
  'client/src/lib/TreeVortex.ts',
  'client/src/lib/BytebeatSynthesizer.ts'
];

// Output directory
const outputDir = 'obfuscated-core';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Obfuscation options
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 1000, // Set a specific value in milliseconds
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

console.log('Starting obfuscation of key algorithm files...');

// Process each file
filesToObfuscate.forEach(filePath => {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Obfuscate
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(content, obfuscationOptions).getObfuscatedCode();
    
    // Create output path
    const outputPath = path.join(outputDir, path.basename(filePath));
    
    // Write obfuscated file
    fs.writeFileSync(outputPath, obfuscatedCode);
    
    console.log(`  --> Obfuscated to ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('\nObfuscation complete! The following files have been obfuscated:');
filesToObfuscate.forEach(file => console.log(` - ${file}`));
console.log(`\nObfuscated files are in the '${outputDir}' directory`);