const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `} from 'lucide-react';`,
  `  Printer\n} from 'lucide-react';`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Added Printer to imports.');
