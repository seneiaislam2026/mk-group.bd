const fs = require('fs');
let code = fs.readFileSync('src/pages/PrintInvoice.tsx', 'utf8');

code = code.replace(
  `min-h-[297mm] overflow-hidden print:max-h-[297mm]`,
  `min-h-[297mm] print:min-h-0 print:h-auto overflow-hidden print:max-h-[297mm]`
);

code = code.replace(
  `w-[210mm] h-[297mm] overflow-hidden print:max-h-[297mm]`,
  `w-[210mm] min-h-[297mm] print:min-h-0 print:h-auto overflow-hidden print:max-h-[297mm]`
);

// Add @page rule to index.css
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('@page')) {
  css += '\n\n@media print {\n  @page {\n    size: A4;\n    margin: 0;\n  }\n}\n';
  fs.writeFileSync('src/index.css', css);
}

fs.writeFileSync('src/pages/PrintInvoice.tsx', code);
console.log('Fixed PrintInvoice height to avoid 2 pages');
