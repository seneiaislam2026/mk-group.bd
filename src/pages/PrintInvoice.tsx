import { useEffect, useState } from 'react';

export default function PrintInvoice() {
  const [invoiceData, setInvoiceData] = useState<any>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const phone = searchParams.get('phone');
    const amount = searchParams.get('amount');
    
    setInvoiceData({ id, name, phone, amount });
    
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  if (!invoiceData) return null;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white min-h-screen text-slate-800 font-sans">
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">MK Group</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Invoice / Delivery Slip</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold text-slate-600">Date: {new Date().toLocaleDateString('en-GB')}</p>
          <div className="mt-2 bg-slate-100 px-3 py-1.5 rounded-lg inline-block border border-slate-200">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-black block mb-0.5">Consignment ID</span>
            <span className="font-mono text-base font-black text-slate-900">{invoiceData.id || 'N/A'}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">From:</h3>
          <p className="font-bold text-slate-800">MK Group</p>
          <p className="text-sm text-slate-600">Dhaka, Bangladesh</p>
          <p className="text-sm font-mono text-slate-600">01969317241</p>
        </div>
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ship To:</h3>
          <p className="font-bold text-slate-800 text-lg">{invoiceData.name}</p>
          <p className="text-sm font-mono text-slate-600 font-bold">{invoiceData.phone}</p>
        </div>
      </div>
      
      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-black text-slate-700">Description</th>
              <th className="p-4 text-sm font-black text-slate-700 text-right">Amount (COD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-slate-100">
                <p className="font-bold text-slate-800">Parcel Delivery via Courier</p>
                <p className="text-xs text-slate-500 font-medium">Consignment: {invoiceData.id}</p>
              </td>
              <td className="p-4 border-b border-slate-100 text-right font-black font-mono text-lg">
                ৳{invoiceData.amount}
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50">
            <tr>
              <td className="p-4 text-right text-sm font-black text-slate-500 uppercase tracking-wider">Total Collection:</td>
              <td className="p-4 text-right font-black font-mono text-2xl text-emerald-700">৳{invoiceData.amount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="mt-16 text-center text-sm font-bold text-slate-400">
        <p>Thank you for shopping with MK Group!</p>
        <p className="mt-1 text-xs">This is an auto-generated slip for Steadfast Courier package tracking.</p>
      </div>
      
      <div className="mt-8 flex justify-center print:hidden">
        <button 
          onClick={() => window.print()} 
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800"
        >
          Print Now
        </button>
      </div>
    </div>
  );
}
