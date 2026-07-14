const fs = require('fs');
let code = fs.readFileSync('src/pages/PrintInvoice.tsx', 'utf8');

// 1. Reduce empty rows to 2
code = code.replace(
  `{Array.from({ length: Math.max(0, 10 - orderItems.length) }).map((_, idx) => (`,
  `{Array.from({ length: 2 }).map((_, idx) => (`
);

// 2. Move barcode above date
// Current left div has the barcode:
const leftDivTarget = `<table className="border-collapse border border-black text-xs font-bold w-64">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">Invoice No:</td>
                <td className="border border-black px-2 py-1">{invoiceData.consignmentId || invoiceData.id || ''}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">ID:</td>
                <td className="border border-black px-2 py-1">{invoiceData.id || ''}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">Name:</td>
                <td className="border border-black px-2 py-1">{invoiceData.name || ''}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">Contact:</td>
                <td className="border border-black px-2 py-1">{invoiceData.phone || ''}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">Address:</td>
                <td className="border border-black px-2 py-1">{invoiceData.address || ''}</td>
              </tr>
            </tbody>
          </table>
          {invoiceData.id && (
            <div className="mt-2 ml-[-10px] scale-[0.8] origin-left">
              <Barcode value={invoiceData.id} height={40} width={1.5} fontSize={12} margin={0} displayValue={false} />
            </div>
          )}`;

const leftDivReplace = `<table className="border-collapse border border-black text-xs font-bold w-64">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">Invoice No:</td>
                <td className="border border-black px-2 py-1">{invoiceData.consignmentId || invoiceData.id || ''}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">ID:</td>
                <td className="border border-black px-2 py-1">{invoiceData.id || ''}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">Name:</td>
                <td className="border border-black px-2 py-1">{invoiceData.name || ''}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">Contact:</td>
                <td className="border border-black px-2 py-1">{invoiceData.phone || ''}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">Address:</td>
                <td className="border border-black px-2 py-1">{invoiceData.address || ''}</td>
              </tr>
            </tbody>
          </table>`;

code = code.replace(leftDivTarget, leftDivReplace);

const rightDivTarget = `<table className="border-collapse border border-black text-xs font-bold w-48">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-50">DATE:</td>
                <td className="border border-black px-2 py-1">{displayDate}</td>
              </tr>
            </tbody>
          </table>`;

const rightDivReplace = `<div className="flex flex-col items-end gap-2">
            {invoiceData.id && (
              <div className="scale-[0.8] origin-right mb-1">
                <Barcode value={invoiceData.id} height={40} width={1.5} fontSize={12} margin={0} displayValue={false} />
              </div>
            )}
            <table className="border-collapse border border-black text-xs font-bold w-48">
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1 bg-gray-50">DATE:</td>
                  <td className="border border-black px-2 py-1">{displayDate}</td>
                </tr>
              </tbody>
            </table>
          </div>`;

code = code.replace(rightDivTarget, rightDivReplace);

// Fix flex-1 so it doesn't stretch 
code = code.replace(`flex-1`, `mb-4`);
// Add max height to main container
code = code.replace(`w-[210mm] h-[297mm] overflow-hidden`, `w-[210mm] h-[297mm] overflow-hidden print:max-h-[297mm] page-break-after-avoid`);
// Bring signatures closer
code = code.replace(`mt-auto pt-16`, `mt-4 pt-4`);

fs.writeFileSync('src/pages/PrintInvoice.tsx', code);
console.log('Fixed invoice layout.');
