import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create distribution directory
const distDir = 'crystal-quantum-sim-dist';
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// Run obfuscation
console.log('Running code obfuscation...');
try {
  execSync('node obfuscate.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error during obfuscation:', error.message);
  process.exit(1);
}

// Files and directories to include in distribution
const filesToCopy = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'drizzle.config.ts',
  'tailwind.config.ts',
  'postcss.config.js',
  '.env.example',
  'README.md',
  'client/index.html',
  'client/src/main.tsx',
  'client/src/App.tsx',
  'client/src/index.css',
  'server/index.ts',
  'server/routes.ts',
  'server/storage.ts',
  'server/vite.ts',
  'shared/schema.ts'
];

// Create a README file if it doesn't exist
if (!fs.existsSync('README.md')) {
  const readmeContent = `# Crystal Quantum Simulation

An interactive quantum crystal simulation with orbit xniner.js, wlquantumbtree, AI entity helper widget, and bytebeat MIDI controller with tree vortex visualization.

## Installation

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Copy \`.env.example\` to \`.env\` and configure settings
4. Start the application: \`npm run dev\`

## Features

- 3D Crystal visualization using OrbitXniner
- Tree Vortex visualization
- MIDI controller with audio synthesis
- AI Helper widget
- MongoDB integration for data persistence

## License

Copyright © 2025. All Rights Reserved.
`;
  fs.writeFileSync('README.md', readmeContent);
  console.log('Created README.md');
}

// Create .env.example file
const envExampleContent = `# Configuration
USE_MONGODB=false

# MongoDB Configuration (if USE_MONGODB=true)
# MONGODB_URI=mongodb://localhost:27017
`;
fs.writeFileSync('.env.example', envExampleContent);
console.log('Created .env.example');

// Copy regular files
for (const file of filesToCopy) {
  try {
    const srcPath = path.resolve(file);
    if (fs.existsSync(srcPath)) {
      // Create directory structure if needed
      const destPath = path.join(distDir, file);
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // Copy the file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${file}`);
    } else {
      console.warn(`Warning: File not found: ${file}`);
    }
  } catch (error) {
    console.error(`Error copying ${file}:`, error.message);
  }
}

// Copy obfuscated directories
const obfuscatedSrcDir = 'obfuscated';
if (fs.existsSync(obfuscatedSrcDir)) {
  const dirs = fs.readdirSync(obfuscatedSrcDir);
  for (const dir of dirs) {
    const srcPath = path.join(obfuscatedSrcDir, dir);
    const destPath = path.join(distDir, dir);
    
    // Create a function to recursively copy directories
    function copyRecursive(src, dest) {
      const stat = fs.statSync(src);
      if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        for (const file of files) {
          const srcFile = path.join(src, file);
          const destFile = path.join(dest, file);
          copyRecursive(srcFile, destFile);
        }
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    
    copyRecursive(srcPath, destPath);
    console.log(`Copied obfuscated directory: ${dir}`);
  }
}

console.log(`\nDistribution package created in '${distDir}' directory`);
console.log('You can now compress this directory and distribute it.');