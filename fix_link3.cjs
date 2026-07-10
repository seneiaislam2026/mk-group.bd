const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldLink = `href={'https://steadfast.com.bd/tracking/' + delivery.tracking_code}`;
const newLink = `href={delivery.tracking_link || 'https://steadfast.com.bd/tracking'}`;

content = content.replace(oldLink, newLink);
fs.writeFileSync(file, content);
console.log("Fixed tracking link again");
