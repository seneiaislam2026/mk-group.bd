const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `  const [customReceiveData, setCustomReceiveData] = useState({ name: '', quantity: '', buyingPrice: '', supplier: '' });`;
const replacement = `  const [customReceiveData, setCustomReceiveData] = useState({ name: '', quantity: '', buyingPrice: '', supplier: '' });
  const [isBoxReceiveModalOpen, setIsBoxReceiveModalOpen] = useState(false);
  const [boxReceiveData, setBoxReceiveData] = useState({ article: '', boxCount: '' });`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Added box receive state');
}
