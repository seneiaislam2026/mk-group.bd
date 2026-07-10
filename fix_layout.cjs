const fs = require('fs');
const file = 'src/components/layout/Layout.tsx';
let content = fs.readFileSync(file, 'utf8');

const importTarget = `import TopBannerNotification from '../ui/TopBannerNotification';`;
const newImport = `import TopBannerNotification from '../ui/TopBannerNotification';\nimport PrintInvoice from '../../pages/PrintInvoice';`;

if (!content.includes('import PrintInvoice')) {
  content = content.replace(importTarget, newImport);
}

const renderTarget = `export default function Layout() {`;
const routerTarget = `  // Helper to extract product ID from hash or query parameters`;

const stateTarget = `  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'landing'>(() => {`;
const newStateTarget = `  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'landing' | 'print'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-invoice')) return 'print';`;

content = content.replace(stateTarget, newStateTarget);

const returnTarget = `      {currentView === 'admin' ? (`;
const newReturnTarget = `      {currentView === 'print' ? (
        <>
          <Helmet>
            <title>ইনভয়েস প্রিন্ট | এম.কে.গ্রুপ</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <PrintInvoice />
        </>
      ) : currentView === 'admin' ? (`;

content = content.replace(returnTarget, newReturnTarget);

const effectTarget = `        setLandingProductId(null);
      } else if (prodId) {`;
const newEffectTarget = `        setLandingProductId(null);
      } else if (window.location.pathname.startsWith('/print-invoice')) {
        setCurrentView('print');
      } else if (prodId) {`;

content = content.replace(effectTarget, newEffectTarget);

fs.writeFileSync(file, content);
console.log('Fixed layout routing');
