const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Layout.tsx', 'utf8');

code = code.replace(
  `import PrintAgreement from '../../pages/PrintAgreement';`,
  `import PrintAgreement from '../../pages/PrintAgreement';\nimport PrintSticker from '../../pages/PrintSticker';`
);

code = code.replace(
  `const [currentView, setCurrentView] = useState<'store' | 'admin' | 'landing' | 'print' | 'print-agreement'>(() => {`,
  `const [currentView, setCurrentView] = useState<'store' | 'admin' | 'landing' | 'print' | 'print-agreement' | 'print-sticker'>(() => {`
);

code = code.replace(
  `if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-agreement')) return 'print-agreement';`,
  `if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-agreement')) return 'print-agreement';\n    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-sticker')) return 'print-sticker';`
);

code = code.replace(
  `} else if (window.location.pathname.startsWith('/print-agreement')) {`,
  `} else if (window.location.pathname.startsWith('/print-sticker')) {\n        setCurrentView('print-sticker');\n      } else if (window.location.pathname.startsWith('/print-agreement')) {`
);

code = code.replace(
  `<PrintInvoice />
        </>`,
  `<PrintInvoice />
        </>
      ) : currentView === 'print-sticker' ? (
        <>
          <Helmet>
            <title>স্টিকার প্রিন্ট | এম.কে.গ্রুপ</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <PrintSticker />
        </>`
);

fs.writeFileSync('src/components/layout/Layout.tsx', code);
console.log('Fixed Layout for PrintSticker.');
