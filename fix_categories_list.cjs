const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const arrTarget = `  // Categories list matching data
  const categoriesList = [
    'গরুর মাংস',
    'খাসির মাংস',
    'মুরগি',
    'মাছ',
    'ডিম',
    'দুধ ও দুগ্ধজাত পণ্য',
    'শুঁটকি',
    'ফ্রোজেন ফুড'
  ];`;

if (content.includes(arrTarget)) {
  content = content.replace(arrTarget, '');
  fs.writeFileSync(file, content);
  console.log('Removed categoriesList from AdminDashboard');
} else {
  console.log('categoriesList not found in AdminDashboard');
}
