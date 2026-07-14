const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); deleteOrder\(order\.id\); \}\}/g, 
  "onClick={(e) => { e.stopPropagation(); if(window.confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id); }}");

code = code.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); deleteProduct\(product\.id\); \}\}/g, 
  "onClick={(e) => { e.stopPropagation(); if(window.confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id); }}");

// also fix for dues, tx, campaigns if any
code = code.replace(/deleteDue\(due\.id\);/g, "if(window.confirm('বকেয়া ডিলিট করতে চান?')) deleteDue(due.id);");

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed confirms');
