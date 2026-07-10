const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/category: 'গরুর মাংস',/g, "category: '',");

fs.writeFileSync(file, content);
console.log('Fixed category states');
