const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `tracking_code: data.consignment?.tracking_code || data.tracking_code,`,
  `tracking_code: data.consignment?.tracking_code || data.tracking_code,
           tracking_link: data.consignment?.tracking_link || data.tracking_link || '',`
);

fs.writeFileSync(file, content);
console.log('Fixed server.ts');
