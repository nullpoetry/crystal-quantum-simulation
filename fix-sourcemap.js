import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the problematic file
const filePath = path.join(__dirname, 'node_modules', 'lucide-react', 'dist', 'esm', 'icons', 'puzzle.js');

// Read the file content
try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the sourcemap reference
  content = content.replace(/\/\/# sourceMappingURL=.*$/m, '');
  
  // Write back the content without the sourcemap reference
  fs.writeFileSync(filePath, content);
  
  console.log('Successfully removed sourcemap reference from', filePath);
} catch (error) {
  console.error('Error fixing sourcemap reference:', error);
}