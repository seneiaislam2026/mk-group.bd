const fs = require('fs');
let code = fs.readFileSync('src/pages/PrintInvoice.tsx', 'utf8');

code = code.replace(
  `{Array.from({ length: 2 }).map((_, idx) => (`,
  `{Array.from({ length: Math.max(0, 2 - orderItems.length) }).map((_, idx) => (`
);

fs.writeFileSync('src/pages/PrintInvoice.tsx', code);
console.log('Fixed invoice empty rows.');
