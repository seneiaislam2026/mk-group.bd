const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `onClick={() => window.open(\`https://steadfast.com.bd/t/\${delivery.consignment_id || delivery.tracking_code}\`, '_blank')}`;
const replacement = `onClick={() => window.open(delivery.tracking_link || \`https://steadfast.com.bd/tracking\`, '_blank')}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Fixed tracking url');
} else {
  console.log('Target not found');
}
