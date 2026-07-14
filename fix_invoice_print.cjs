const fs = require('fs');
let code = fs.readFileSync('src/pages/PrintInvoice.tsx', 'utf8');

code = code.replace(
  `h-[297mm] overflow-hidden print:max-h-[297mm]`,
  `min-h-[297mm]`
);

// fixed length for array from
code = code.replace(
  `{Array.from({ length: Math.max(0, 2 - orderItems.length) }).map((_, idx) => (`,
  `{Array.from({ length: Math.max(0, 15 - orderItems.length) }).map((_, idx) => (`
);

fs.writeFileSync('src/pages/PrintInvoice.tsx', code);
console.log('Fixed PrintInvoice pages and rows');
