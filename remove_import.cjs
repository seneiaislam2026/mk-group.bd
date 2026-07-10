const fs = require('fs');
const file = 'src/pages/PrintAgreement.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { useLocation } from 'react-router-dom'; // Wait, this app might not use react-router. Let's just read from URLSearchParams.", "");

fs.writeFileSync(file, content);
console.log("Removed unused import");
