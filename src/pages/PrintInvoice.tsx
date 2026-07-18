import { useEffect, useState, useRef } from 'react';
import Barcode from 'react-barcode';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function PrintInvoice() {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasPrinted = useRef(false);

  useEffect(() => {
    const fetchInvoiceAndPrint = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id') || searchParams.get('orderId');
      const orderId = searchParams.get('orderId');
      const consignmentId = searchParams.get('consignmentId');
      const name = searchParams.get('name');
      const phone = searchParams.get('phone');
      const amount = searchParams.get('amount');
      
      const initialData = { 
        id, 
        orderId, 
        consignmentId, 
        name, 
        phone, 
        amount 
      };
      
      setInvoiceData(initialData);

      if (id) {
        try {
          const docRef = doc(db, 'orders', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const foundOrder = docSnap.data();
            if (foundOrder.items) {
              setOrderItems(foundOrder.items);
            }
            setInvoiceData((prev: any) => ({
              ...prev,
              name: prev.name || foundOrder.customerName,
              phone: prev.phone || foundOrder.phone,
              address: foundOrder.address,
              amount: foundOrder.total,
              date: foundOrder.date,
              status: foundOrder.status
            }));
          }

          // Query courierHistory where invoice == id
          try {
            const courierRef = collection(db, 'courierHistory');
            const q = query(courierRef, where('invoice', '==', id));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const bookingDoc = querySnapshot.docs[0].data();
              const foundConsignmentId = bookingDoc.tracking_code || bookingDoc.consignment_id;
              if (foundConsignmentId) {
                setInvoiceData((prev: any) => ({
                  ...prev,
                  consignmentId: foundConsignmentId
                }));
              }
            }
          } catch (err) {
            console.error("Error querying courier history:", err);
          }
        } catch (error) {
          console.error("Error loading invoice directly from DB:", error);
        }
      }
      
      setIsLoading(false);

      // Trigger print after rendering is complete
      setTimeout(() => {
        if (!hasPrinted.current) {
          hasPrinted.current = true;
          window.print();
        }
      }, 300);
    };

    fetchInvoiceAndPrint();
  }, []);

  if (isLoading || !invoiceData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4" style={{ fontFamily: 'Tahoma, sans-serif' }}>
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-bold text-xs">ইনভয়েস লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    );
  }

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
  
  const formatInvoiceId = (id: string) => {
    if (!id) return '';
    const clean = id.replace(/^(ord-|ord|man-|man)/i, '');
    if (/^\d+$/.test(clean)) {
      return clean.padStart(3, '0');
    }
    return clean;
  };

  const displayDate = invoiceData.date ? new Date(invoiceData.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

  return (
    <div className="bg-white min-h-screen py-8 print:py-0 print:bg-white flex justify-center text-black print:min-h-0" style={{ fontFamily: 'Tahoma, sans-serif' }}>
      <div className="w-[210mm] min-h-[297mm] print:min-h-0 print:h-[297mm] print:max-h-[297mm] print:overflow-hidden page-break-after-avoid bg-white print:shadow-none p-8 print:p-6 relative box-border text-[13px] leading-tight flex flex-col justify-between">
        
        <div>
          {/* Header Section */}
          <div className="text-center mb-4">
            <div className="flex justify-center items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center overflow-hidden">
                  <img src="https://i.ibb.co/s9n1g23j/1000095789-removebg-preview.png" alt="MK Group Logo" className="w-full h-full object-contain p-1" />
              </div>
              <h1 className="text-2xl font-black tracking-wider uppercase m-0">MK GROUP</h1>
              <div className="text-right text-xs ml-4 font-bold text-blue-800 underline underline-offset-4 decoration-2">
                MK GROUP<br/>
                <span className="text-[9px] text-yellow-600 no-underline block mt-0.5">অপ্রতিরোধ্য অগ্রযাত্রায় আমরা</span>
              </div>
            </div>
            <div className="border border-black p-1 mb-1 inline-block px-4 font-bold text-xs bg-gray-100">
              Pandhoa Bazar, Beside Jahangirnagar University, Savar, Dhaka
            </div>
            <br />
            <div className="border border-black px-4 py-0.5 inline-block text-[10px] font-bold mt-0.5 bg-gray-100">
              Email: mkkhanmahadi01969@gmail.com, Phone: 01969317241, 01330457810
            </div>
          </div>

          <h2 className="text-lg font-bold text-center tracking-[0.2em] mb-3 uppercase">INVOICE</h2>

          {/* Info Tables */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-2">
            <table className="border-collapse border border-black text-xs font-bold w-64">
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1 bg-gray-50">Invoice No:</td>
                  <td className="border border-black px-2 py-1">{invoiceData.consignmentId || invoiceData.id || ''}</td>
                </tr>
                {invoiceData.consignmentId && (
                  <tr>
                    <td className="border border-black px-2 py-1 bg-emerald-50 text-emerald-800">Booking No:</td>
                    <td className="border border-black px-2 py-1 text-emerald-800 font-extrabold">{invoiceData.consignmentId}</td>
                  </tr>
                )}
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
            <div className="flex flex-col items-end gap-1">
              {invoiceData.id && (
                <div className="scale-[0.75] origin-right mb-1">
                  <Barcode value={invoiceData.id} height={35} width={1.4} fontSize={10} margin={0} displayValue={false} />
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
          <table className="w-full border-collapse border border-black text-center text-xs font-bold mb-3">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-2 py-1.5">Serial No</th>
                <th className="border border-black px-2 py-1.5 w-1/3">Article</th>
                <th className="border border-black px-2 py-1.5">Unit</th>
                <th className="border border-black px-2 py-1.5">Quantity</th>
                <th className="border border-black px-2 py-1.5">Rate</th>
                <th className="border border-black px-2 py-1.5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.length > 0 ? (
                  orderItems.map((item, index) => {
                      const quantityText = item.quantity >= 24 ? `${Math.floor(item.quantity/24)} Box ${item.quantity%24 > 0 ? (item.quantity%24 + ' Pair') : ''}` : `${item.quantity} Pair`;
                      return (
                          <tr key={index}>
                              <td className="border border-black px-2 py-1.5">{index + 1}</td>
                              <td className="border border-black px-2 py-1.5">{item.name}</td>
                              <td className="border border-black px-2 py-1.5">Pair</td>
                              <td className="border border-black px-2 py-1.5">{quantityText}</td>
                              <td className="border border-black px-2 py-1.5">{item.price}</td>
                              <td className="border border-black px-2 py-1.5">{item.price * item.quantity}</td>
                          </tr>
                      );
                  })
              ) : (
                  <tr>
                      <td className="border border-black px-2 py-1.5">1</td>
                      <td className="border border-black px-2 py-1.5">Items loading...</td>
                      <td className="border border-black px-2 py-1.5">-</td>
                      <td className="border border-black px-2 py-1.5">-</td>
                      <td className="border border-black px-2 py-1.5">-</td>
                      <td className="border border-black px-2 py-1.5">{parsedTotal}</td>
                  </tr>
              )}
              
              {/* Fill exactly 3 empty rows to keep the invoice compact on a single page */}
              {Array.from({ length: 3 }).map((_, idx) => (
                <tr key={'empty-'+idx}>
                  <td className="border border-black px-2 py-2">&nbsp;</td>
                  <td className="border border-black px-2 py-2">&nbsp;</td>
                  <td className="border border-black px-2 py-2">&nbsp;</td>
                  <td className="border border-black px-2 py-2">&nbsp;</td>
                  <td className="border border-black px-2 py-2">&nbsp;</td>
                  <td className="border border-black px-2 py-2">&nbsp;</td>
                </tr>
              ))}

              {/* Calculations Footer */}
              <tr>
                <td colSpan={2} rowSpan={4} className="border border-black p-2.5 text-left align-top text-[10px] leading-normal">
                  <div className="font-extrabold text-slate-800 border-b border-black pb-0.5 mb-1.5 uppercase tracking-wider text-[10px]">
                    Terms &amp; Conditions:
                  </div>
                  <ul className="list-decimal pl-3.5 m-0 space-y-1 text-slate-800 font-bold">
                    <li>যেকোনো প্রয়োজনে আমাদের যোগাযোগ নম্বরে যোগাযোগ করুন।</li>
                    <li>আমাদের উপর আস্থা রাখার জন্য ধন্যবাদ।</li>
                  </ul>
                </td>
                <td colSpan={3} className="border border-black px-2 py-1.5 text-right bg-gray-50">Courier Charge:</td>
                <td className="border border-black px-2 py-1.5">{Math.max(0, courierCharge)} Taka</td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-black px-2 py-1.5 text-right bg-gray-50">Condition charge:</td>
                <td className="border border-black px-2 py-1.5">{conditionCharge} Taka</td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-black px-2 py-1.5 text-center bg-gray-100 uppercase tracking-widest font-black">Total</td>
                <td className="border border-black px-2 py-1.5 bg-gray-100 font-black">{subtotal} Taka</td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-black px-2 py-1.5 text-center uppercase tracking-widest font-black">TOTAL Amount:</td>
                <td className="border border-black px-2 py-1.5 font-black text-sm">{parsedTotal} Taka</td>
              </tr>
            </tbody>
          </table>

          {/* Payment Status */}
          <div className="font-bold border border-black inline-block px-3 py-1 bg-gray-100 text-xs">
            Payment Status: cash on delivery
          </div>
        </div>

        <div>
          {/* Signatures */}
          <div className="pt-2 flex justify-between items-end font-bold text-xs">
            <div className="text-center">
              <div className="w-44 border-t border-black pt-1">
                DIRECTOR OF MK GROUP<br/>
                <span className="text-[10px] font-normal">MD MISBAH KHAN</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-44 border-t border-black pt-1">
                MANAGER OF MK GROUP<br/>
                <span className="text-[10px] font-normal">MD SHA FIUL ALAM</span>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-4 text-center">
            <div className="font-bold text-base mb-1">PHONE: 01969317241</div>
            <div className="border border-black inline-block px-12 py-0.5 font-bold text-xs bg-gray-100 italic">
              Thanks will come again
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}