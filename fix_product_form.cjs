const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/stock: ''\n  }\);/g, "stock: '',\n    article: ''\n  });");

content = content.replace(/stock: ''\n    }\);/g, "stock: '',\n      article: ''\n    });");

fs.writeFileSync(file, content);
console.log('Fixed product form state');
