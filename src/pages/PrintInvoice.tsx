import { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import { useCart } from '../context/CartContext';

export default function PrintInvoice() {
  const { orders } = useCart();
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id') || searchParams.get('orderId');
    const orderId = searchParams.get('orderId');
    const consignmentId = searchParams.get('consignmentId');
    const name = searchParams.get('name');
    const phone = searchParams.get('phone');
    const amount = searchParams.get('amount');
    
    setInvoiceData({ 
      id, 
      orderId, 
      consignmentId, 
      name, 
      phone, 
      amount 
    });
    
    if (id && orders.length > 0) {
        const foundOrder = orders.find(o => o.id === id);
        if (foundOrder && foundOrder.items) {
            setOrderItems(foundOrder.items);
            // also update name/phone if missing
            setInvoiceData(prev => ({
                ...prev,
                name: prev.name || foundOrder.customerName,
                phone: prev.phone || foundOrder.phone,
                address: foundOrder.address,
                amount: foundOrder.total,
                date: foundOrder.date,
                status: foundOrder.status
            }));
        }
    }
    
    setTimeout(() => {
      window.print();
    }, 1200);
  }, [orders]);

  if (!invoiceData) return null;

  // Assuming Courier 750, Condition charge 1%... 
  // Let's guess or just show fixed if not available.
  const parsedTotal = parseFloat(invoiceData.amount) || 0;
  // Let's compute subtotal from items if available
  const subtotal = orderItems.length > 0 
    ? orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : parsedTotal;

  // In the user's system, we don't have Courier / Condition charge explicitly saved per order, 
  // but total = subtotal + courier + condition.
  // We can calculate condition as Math.round(subtotal * 0.01).
  const conditionCharge = Math.round(subtotal * 0.01);
  const courierCharge = parsedTotal > subtotal ? (parsedTotal - subtotal - conditionCharge) : 0;
  
  const displayDate = invoiceData.date ? new Date(invoiceData.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

  return (
    <div className="bg-white min-h-screen py-8 font-serif print:py-0 print:bg-white flex justify-center text-black">
      <div className="w-[210mm] min-h-[297mm] page-break-after-avoid bg-white print:shadow-none p-8 relative box-border text-[13px] leading-tight flex flex-col">
        
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center overflow-hidden">
                <img src="https://i.ibb.co/s9n1g23j/1000095789-removebg-preview.png" alt="MK Group Logo" className="w-full h-full object-contain p-1" />
            </div>
            <h1 className="text-3xl font-black tracking-wider uppercase m-0">MK GROUP</h1>
            <div className="text-right text-xs ml-4 font-bold text-blue-800 underline underline-offset-4 decoration-2">
              MK GROUP<br/>
              <span className="text-[9px] text-yellow-600 no-underline block mt-0.5">অপ্রতিরোধ্য অগ্রযাত্রায় আমরা</span>
            </div>
          </div>
          <div className="border border-black p-1.5 mb-1 inline-block px-4 font-bold text-sm bg-gray-100">
            Pandhoa Bazar, Beside Jahangirnagar University, Savar, Dhaka
          </div>
          <div className="border border-black px-4 py-0.5 inline-block text-[11px] font-bold mt-1 bg-gray-100">
            Email: mkkhanmahadi01969@gmail.com, Phone: 01969317241, 01330457810
          </div>
        </div>

        <h2 className="text-xl font-bold text-center tracking-[0.2em] mb-4 uppercase">INVOICE</h2>

        {/* Info Tables */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
          <table className="border-collapse border border-black text-xs font-bold w-64">
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
          </div>
          <div className="flex flex-col items-end gap-2">
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
          </div>
        </div>

        {/* Main Items Table */}
        <table className="w-full border-collapse border border-black text-center text-xs font-bold mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-2">Serial No</th>
              <th className="border border-black px-2 py-2 w-1/3">Article</th>
              <th className="border border-black px-2 py-2">Unit</th>
              <th className="border border-black px-2 py-2">Quantity</th>
              <th className="border border-black px-2 py-2">Rate</th>
              <th className="border border-black px-2 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length > 0 ? (
                orderItems.map((item, index) => {
                    const quantityText = item.quantity >= 24 ? `${Math.floor(item.quantity/24)} Box ${item.quantity%24 > 0 ? (item.quantity%24 + ' Pair') : ''}` : `${item.quantity} Pair`;
                    return (
                        <tr key={index}>
                            <td className="border border-black px-2 py-2">{index + 1}</td>
                            <td className="border border-black px-2 py-2">{item.name}</td>
                            <td className="border border-black px-2 py-2">Pair</td>
                            <td className="border border-black px-2 py-2">{quantityText}</td>
                            <td className="border border-black px-2 py-2">{item.price}</td>
                            <td className="border border-black px-2 py-2">{item.price * item.quantity}</td>
                        </tr>
                    );
                })
            ) : (
                <tr>
                    <td className="border border-black px-2 py-2">1</td>
                    <td className="border border-black px-2 py-2">Items loading...</td>
                    <td className="border border-black px-2 py-2">-</td>
                    <td className="border border-black px-2 py-2">-</td>
                    <td className="border border-black px-2 py-2">-</td>
                    <td className="border border-black px-2 py-2">{parsedTotal}</td>
                </tr>
            )}
            
            {/* Fill empty rows to make table look full */}
            {Array.from({ length: Math.max(0, 15 - orderItems.length) }).map((_, idx) => (
              <tr key={'empty-'+idx}>
                <td className="border border-black px-2 py-3.5">&nbsp;</td>
                <td className="border border-black px-2 py-3.5">&nbsp;</td>
                <td className="border border-black px-2 py-3.5">&nbsp;</td>
                <td className="border border-black px-2 py-3.5">&nbsp;</td>
                <td className="border border-black px-2 py-3.5">&nbsp;</td>
                <td className="border border-black px-2 py-3.5">&nbsp;</td>
              </tr>
            ))}

            {/* Calculations Footer */}
            <tr>
              <td colSpan={2} rowSpan={4} className="border border-black px-2 py-2 text-left align-top">
                {/* Empty left area */}
              </td>
              <td colSpan={3} className="border border-black px-2 py-2 text-right bg-gray-50">Courier Charge:</td>
              <td className="border border-black px-2 py-2">{Math.max(0, courierCharge)} Taka</td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black px-2 py-2 text-right bg-gray-50">Condition charge:</td>
              <td className="border border-black px-2 py-2">{conditionCharge} Taka</td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black px-2 py-2 text-center bg-gray-100 uppercase tracking-widest font-black">Total</td>
              <td className="border border-black px-2 py-2 bg-gray-100 font-black">{subtotal} Taka</td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black px-2 py-2 text-center uppercase tracking-widest font-black">TOTAL Amount:</td>
              <td className="border border-black px-2 py-2 font-black text-base">{parsedTotal} Taka</td>
            </tr>
          </tbody>
        </table>

        {/* Payment Status */}
        <div className="mt-4 font-bold border border-black inline-block px-3 py-1 bg-gray-100 text-sm">
          Payment Status: cash on delivery
        </div>

        {/* Signatures */}
        <div className="mt-4 pt-4 flex justify-between items-end font-bold text-sm">
          <div className="text-center">
            <div className="w-48 border-t border-black pt-1">
              DIRECTOR OF MK GROUP<br/>
              <span className="text-xs font-normal">MD MISBAH KHAN</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-48 border-t border-black pt-1">
              MANAGER OF MK GROUP<br/>
              <span className="text-xs font-normal">MD SHA FIUL ALAM</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <div className="font-bold text-lg mb-1">PHONE: 01969317241</div>
          <div className="border border-black inline-block px-12 py-1 font-bold bg-gray-100 italic">
            Thanks will come again
          </div>
        </div>

      </div>
    </div>
  );
}