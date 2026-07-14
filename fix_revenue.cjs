const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Replace the manual transaction creation in updateOrderStatus
code = code.replace(/if \(newStatus === 'Completed'\) \{\s*const txExists = transactions\.some\(t => t\.note && t\.note\.includes\(`ID: \$\{order\.id\}`\)\);\s*if \(!txExists && order\.total > 0\) \{\s*const newTx = \{\s*id: `t-del-man-\$\{Date\.now\(\)\}`,\s*type: 'income' as const,\s*category: 'পণ্য বিক্রি',\s*amount: order\.total,\s*date: new Date\(\)\.toISOString\(\),\s*note: `অর্ডার ডেলিভারি সম্পন্ন \(ID: \$\{order\.id\}\) - \$\{order\.customerName\}`\s*\};\s*setTransactions\(prev => \[newTx, \.\.\.prev\]\);\s*addNotification\('আয় আপডেট 💰', 'ডেলিভারি সম্পন্ন হওয়া অর্ডারের টাকা আয় অপশনে যুক্ত হয়েছে!'\);\s*\}\s*\}/g, "");

// Replace the manual transaction creation for courier sync
code = code.replace(/const txExists = transactions\.some\(t => t\.note && t\.note\.includes\(booking\.consignment_id\)\);\s*if \(amt > 0 && !txExists\) \{\s*newTransactions\.push\(\{\s*id: `t-del-\$\{Date\.now\(\)\}-\$\{i\}`,\s*type: 'income' as const,\s*category: 'পণ্য বিক্রি',\s*amount: amt,\s*date: new Date\(\)\.toISOString\(\),\s*note: `কুরিয়ার ডেলিভারি \(ID: \$\{booking\.consignment_id\}\) - \$\{booking\.customer_name \|\| 'অজানা গ্রাহক'\}`\s*\}\);\s*\}/g, "");

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed revenue double count.');
