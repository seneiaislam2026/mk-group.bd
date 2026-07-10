const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/description: productFormData\.description,/g, "description: productFormData.description,\n      article: productFormData.article,");

content = content.replace(/description: product\.description \|\| '',/g, "description: product.description || '',\n      article: product.article || '',");

fs.writeFileSync(file, content);
console.log('Fixed product submit and edit');
