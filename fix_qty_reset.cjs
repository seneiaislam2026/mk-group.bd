const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `setManualSelectedQuantity(1);\n                      setManualSelectedProductId('');`,
  `setManualSelectedQuantity('');\n                      setManualSelectedPrice('');\n                      setManualSelectedProductId('');`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed quantity reset.');
