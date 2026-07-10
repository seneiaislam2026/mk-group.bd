const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = 'c => String(c.tracking_code || "").toLowerCase().includes(String(courierSearch || "").toLowerCase()) || String(c.customer_name || "").toLowerCase().includes(String(courierSearch || "").toLowerCase())';
const newStr = 'c => c && (String(c.tracking_code || "").toLowerCase().includes(String(courierSearch || "").toLowerCase()) || String(c.customer_name || "").toLowerCase().includes(String(courierSearch || "").toLowerCase()))';

content = content.split(oldStr).join(newStr);
fs.writeFileSync(file, content);
console.log("Fixed courier filter extra safety");
