const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(/if\(window\.confirm\('[^']+'\)\)\s*if\(window\.confirm\('[^']+'\)\)/g, "if(window.confirm('আপনি কি নিশ্চিত?'))");

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed double confirms');
