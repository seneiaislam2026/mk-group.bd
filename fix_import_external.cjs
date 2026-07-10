const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ExternalLink,')) {
  content = content.replace("import { PackagePlus } from \"lucide-react\";", "import { PackagePlus, ExternalLink } from \"lucide-react\";");
  fs.writeFileSync(file, content);
  console.log("Imported ExternalLink");
}
