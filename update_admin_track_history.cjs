const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/tracking_code: data\.consignment\?\.tracking_code \|\| data\.tracking_code \|\| '',/g, `tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        tracking_link: data.consignment?.tracking_link || data.tracking_link || '',`);

fs.writeFileSync(file, content);
console.log('Fixed tracking history');
