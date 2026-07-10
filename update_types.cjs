const fs = require('fs');
const file = 'src/types.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('article?: string;')) {
  content = content.replace('stock?: number;', 'stock?: number;\n  article?: string;');
  fs.writeFileSync(file, content);
  console.log('Updated types.ts');
}
