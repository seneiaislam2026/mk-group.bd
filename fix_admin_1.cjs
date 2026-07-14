const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Fix text
code = code.replace(
  "{ label: 'মোট প্রোটিন পণ্য', value: products.length.toString(), countDesc: 'টি লাইভ', color: 'bg-purple-500', icBg: 'bg-purple-50 text-purple-500' }",
  "{ label: 'মোট পণ্য', value: products.length.toString(), countDesc: 'টি লাইভ', color: 'bg-purple-500', icBg: 'bg-purple-50 text-purple-500' }"
);

// Fix deleteOrder to include stopPropagation
code = code.replace(
  "onClick={() => { if(confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id); }}",
  "onClick={(e) => { e.stopPropagation(); if(confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id); }}"
);
code = code.replace(
  "onClick={() => { if(confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id); }}",
  "onClick={(e) => { e.stopPropagation(); if(confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id); }}"
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed text and deleteOrder stopPropagation.');
