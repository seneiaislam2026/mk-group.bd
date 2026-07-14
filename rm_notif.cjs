const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `                  addNotification(
                    'ম্যানুয়াল অর্ডার বুকিং করা হয়েছে 📝',
                    \`গ্রাহক \${manualOrderCustomerName} এর জন্য ৳\${grandTotal} টাকার নতুন অর্ডার বুকিং সম্পন্ন।\`
                  );`,
  ``
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Removed addNotification.');
