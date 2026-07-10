const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const bad = '</aside>';
const good = ')}';

if (content.includes(bad)) {
  content = content.replace(bad, good);
  fs.writeFileSync(file, content);
  console.log("Fixed </aside>");
}
