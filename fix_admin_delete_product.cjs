const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `onClick={() => { if(confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id); }}`,
  `onClick={(e) => { e.stopPropagation(); if(confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id); }}`
);

code = code.replace(
  `onClick={() => { if(confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id); }}`,
  `onClick={(e) => { e.stopPropagation(); if(confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id); }}`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed deleteProduct stopPropagation.');
