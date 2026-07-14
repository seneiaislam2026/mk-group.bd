const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(/deleteOrder\(order\.id\);/g, "if(window.confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id);");
code = code.replace(/deleteProduct\(product\.id\);/g, "if(window.confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id);");

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed deletes');
