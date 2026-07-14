const fs = require('fs');
let code = fs.readFileSync('src/pages/PrintInvoice.tsx', 'utf8');

// The first script didn't apply the div close. Let's find:
//          </table>
//
//          <table className="border-collapse border border-black text-xs font-bold w-48">
// and replace it.

code = code.replace(
  /<table className="border-collapse border border-black text-xs font-bold w-64">([\s\S]*?)<\/table>\s*<table className="border-collapse border border-black text-xs font-bold w-48">/,
  `<table className="border-collapse border border-black text-xs font-bold w-64">$1</table>
          {invoiceData.id && (
            <div className="mt-2 ml-[-10px] scale-[0.8] origin-left">
              <Barcode value={invoiceData.id} height={40} width={1.5} fontSize={12} margin={0} displayValue={false} />
            </div>
          )}
          </div>
          <table className="border-collapse border border-black text-xs font-bold w-48">`
);

// Update padding and height
code = code.replace(
  `className="w-[210mm] min-h-[297mm] bg-white print:shadow-none p-10 relative box-border text-[13px] leading-tight flex flex-col"`,
  `className="w-[210mm] h-[297mm] overflow-hidden bg-white print:shadow-none p-8 relative box-border text-[13px] leading-tight flex flex-col"`
);

// Also the "Pyment Status" typo
code = code.replace(`Pyment Status:`, `Payment Status:`);

fs.writeFileSync('src/pages/PrintInvoice.tsx', code);
console.log('Fixed PrintInvoice markup.');
