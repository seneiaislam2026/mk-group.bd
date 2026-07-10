const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/প্রিমিয়াম গরুর মাংস \(হাড় ছাড়া\)/g, 'প্রিমিয়াম পণ্য');
content = content.replace(/গরুর মাংস/g, 'সাধারণ পণ্য');

fs.writeFileSync(file, content);
console.log('Fixed mock category');
