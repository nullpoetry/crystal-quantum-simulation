import JavaScriptObfuscator from 'javascript-obfuscator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for obfuscation
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: true,
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

// List of directories to obfuscate
const directoriesToObfuscate = [
  'client/src/lib',
  'client/src/hooks',
  'client/src/components'
];

// Output directory for obfuscated files
const outputDir = 'obfuscated';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Function to recursively process directories
function processDirectory(directory) {
  const fullPath = path.resolve(directory);
  const files = fs.readdirSync(fullPath);
  
  // Create the same directory structure in output directory
  const relativePath = path.relative('.', directory);
  const outputPath = path.join(outputDir, relativePath);
  
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(path.join(directory, file));
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      // Process JavaScript/TypeScript files
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const outputFilePath = path.join(outputPath, file);
        
        console.log(`Obfuscating: ${filePath}`);
        
        // Obfuscate the content
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(content, obfuscationOptions).getObfuscatedCode();
        
        // Write the obfuscated code to output directory
        fs.writeFileSync(outputFilePath, obfuscatedCode);
        console.log(`  --> Output: ${outputFilePath}`);
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    } else {
      // Copy non-JavaScript files as is
      const outputFilePath = path.join(outputPath, file);
      fs.copyFileSync(filePath, outputFilePath);
      console.log(`Copied: ${filePath} --> ${outputFilePath}`);
    }
  }
}

// Process all directories
console.log('Starting code obfuscation...');
for (const directory of directoriesToObfuscate) {
  processDirectory(directory);
}
console.log('Code obfuscation complete!');
console.log(`Obfuscated files are in the '${outputDir}' directory`);