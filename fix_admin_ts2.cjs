const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// fix product price error (2465)
code = code.replace(
  `item.price * item.quantity`,
  `((item as any).price || 0) * item.quantity`
);

// fix type income in line 2726 and 2836
code = code.replace(
  `type: 'income',
                                            category: 'পণ্য বিক্রি',`,
  `type: 'income' as 'income' | 'expense',
                                            category: 'পণ্য বিক্রি',`
);

code = code.replace(
  `type: 'income',
                                          category: 'পণ্য বিক্রি',`,
  `type: 'income' as 'income' | 'expense',
                                          category: 'পণ্য বিক্রি',`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed more TS errors in AdminDashboard.');
