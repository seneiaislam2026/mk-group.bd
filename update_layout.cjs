const fs = require('fs');
const file = 'src/components/layout/Layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
content = content.replace("import PrintInvoice from '../../pages/PrintInvoice';", "import PrintInvoice from '../../pages/PrintInvoice';\nimport PrintAgreement from '../../pages/PrintAgreement';");

// Update state router
content = content.replace("  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'landing' | 'print'>(() => {", "  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'landing' | 'print' | 'print-agreement'>(() => {");
content = content.replace("    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-invoice')) return 'print';", "    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-invoice')) return 'print';\n    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-agreement')) return 'print-agreement';");

content = content.replace("      } else if (window.location.pathname.startsWith('/print-invoice')) {", "      } else if (window.location.pathname.startsWith('/print-agreement')) {\n        setCurrentView('print-agreement');\n      } else if (window.location.pathname.startsWith('/print-invoice')) {");

content = content.replace("      {currentView === 'print' ? (", "      {currentView === 'print-agreement' ? (\n        <>\n          <Helmet>\n            <title>চুক্তিনামা প্রিন্ট | এম.কে.গ্রুপ</title>\n            <meta name=\"robots\" content=\"noindex, nofollow\" />\n          </Helmet>\n          <PrintAgreement />\n        </>\n      ) : currentView === 'print' ? (");

fs.writeFileSync(file, content);
console.log("Layout updated for print agreement route");
