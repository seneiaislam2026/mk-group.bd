import { useEffect, useState, useRef } from 'react';
import Barcode from 'react-barcode';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CourierBooking {
  consignment_id: string | number;
  tracking_code: string;
  tracking_link?: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  amount: number | string;
  invoice: string;
  created_at: string;
  delivery_type?: 'home' | 'point';
  recipient_address?: string;
}

export default function PrintSticker() {
  const [stickers, setStickers] = useState<CourierBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState<string>('');
  const hasPrinted = useRef(false);

  useEffect(() => {
    const fetchStickers = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const dateParam = searchParams.get('date');
      const singleId = searchParams.get('id') || searchParams.get('tracking_code');
      const singleName = searchParams.get('name');
      const singlePhone = searchParams.get('phone');
      const singleAddress = searchParams.get('address');
      const singleAmount = searchParams.get('amount');
      const singleDeliveryType = searchParams.get('deliveryType') as 'home' | 'point' | null;

      if (dateParam) {
        setFilterDate(dateParam);
        try {
          const courierRef = collection(db, 'courierHistory');
          const querySnapshot = await getDocs(courierRef);
          const list: CourierBooking[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data() as CourierBooking;
            // Check if created_at starts with the requested date YYYY-MM-DD
            if (data && data.created_at && data.created_at.startsWith(dateParam)) {
              list.push(data);
            }
          });

          // Sort by created_at ascending
          list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          setStickers(list);
        } catch (error) {
          console.error('Error fetching stickers from DB:', error);
        }
      } else if (singleId || singleName) {
        // Fallback to single sticker printing
        setStickers([{
          consignment_id: singleId || '',
          tracking_code: singleId || '',
          customer_name: singleName || '',
          customer_phone: singlePhone || '',
          amount: singleAmount || '0',
          invoice: '',
          created_at: new Date().toISOString(),
          delivery_type: singleDeliveryType || 'home',
          status: 'pending',
          recipient_address: singleAddress || ''
        }]);
      }
      
      setIsLoading(false);
    };

    fetchStickers();
  }, []);

  useEffect(() => {
    if (!isLoading && stickers.length > 0 && !hasPrinted.current) {
      // Trigger print after rendering is complete
      const timer = setTimeout(() => {
        hasPrinted.current = true;
        window.print();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, stickers]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-bold font-sans text-xs">স্টিকার সমূহ তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    );
  }

  if (stickers.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-500 font-black text-lg mb-2">কোনো বুকিং পাওয়া যায়নি!</div>
        <p className="text-sm text-slate-500 font-bold font-sans">
          {filterDate ? `${filterDate} তারিখে কোনো কুরিয়ার বুকিং সম্পন্ন করা হয়নি।` : 'কোনো স্টিকার ডাটা প্রদান করা হয়নি।'}
        </p>
        <button 
          onClick={() => window.close()} 
          className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-sans"
        >
          বন্ধ করুন
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen print:bg-white text-black font-sans flex flex-col items-center py-8 print:py-0">
      {/* Print styles */}
      <style>{`
        @page {
          size: 3in 3in;
          margin: 0;
        }
        @media print {
          html, body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .sticker-card {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 2.9in !important;
            height: 2.9in !important;
            border-radius: 0 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            page-break-inside: avoid;
          }
        }
      `}</style>
      {stickers.map((sticker, idx) => (
        <div 
          key={idx} 
          className={`sticker-card w-[2.9in] h-[2.9in] bg-white border border-slate-300 shadow-sm rounded mb-4 print:mb-0 p-2 flex flex-col justify-between box-border overflow-hidden ${
            idx < stickers.length - 1 ? 'page-break' : ''
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-dashed border-slate-300 pb-1.5 mb-1.5 shrink-0">
            <div>
              <h1 className="text-sm font-black tracking-wider text-black leading-tight">MK GROUP</h1>
              <p className="text-[7px] font-bold text-slate-500 leading-tight">
                Savar, Dhaka | 01969317241
              </p>
            </div>
            <div className="text-right">
              {sticker.delivery_type === 'point' ? (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded text-[8px] font-black uppercase inline-block">
                  Point
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded text-[8px] font-black uppercase inline-block">
                  Home
                </span>
              )}
            </div>
          </div>

          {/* Consignee Info */}
          <div className="flex-1 space-y-0.5 text-[10px] text-left overflow-hidden">
            <div className="flex items-start gap-1">
              <span className="font-extrabold text-slate-500 text-[8px] uppercase w-10 shrink-0">Name:</span>
              <span className="font-black text-black leading-tight truncate">{sticker.customer_name}</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-extrabold text-slate-500 text-[8px] uppercase w-10 shrink-0">Phone:</span>
              <span className="font-black text-black font-mono leading-tight">{sticker.customer_phone}</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-extrabold text-slate-500 text-[8px] uppercase w-10 shrink-0">Address:</span>
              <span className="font-bold text-slate-800 leading-tight line-clamp-2">
                {sticker.recipient_address || (sticker as any).customer_address || (sticker as any).address || 'ঠিকানা পাওয়া যায়নি'}
              </span>
            </div>
            <div className="flex items-start gap-1 pt-0.5 mt-0.5 border-t border-slate-100">
              <span className="font-extrabold text-slate-500 text-[8px] uppercase w-10 shrink-0">ID:</span>
              <span className="font-bold text-indigo-900 font-mono bg-indigo-50 px-1 rounded leading-tight">
                {sticker.consignment_id || sticker.tracking_code || 'N/A'}
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-extrabold text-slate-500 text-[8px] uppercase w-10 shrink-0">COD Cash:</span>
              <span className="font-black text-emerald-800 text-xs leading-tight">৳{sticker.amount}</span>
            </div>
          </div>

          {/* Barcode & Tracking */}
          <div className="mt-1 pt-1.5 border-t border-dashed border-slate-300 flex flex-col items-center justify-end shrink-0 h-[38px] overflow-hidden">
            {sticker.consignment_id || sticker.tracking_code ? (
              <div className="scale-[0.8] origin-bottom flex items-end justify-center h-full">
                <Barcode 
                  value={String(sticker.consignment_id || sticker.tracking_code)} 
                  height={28} 
                  width={1.2} 
                  fontSize={10} 
                  margin={0} 
                  displayValue={true} 
                />
              </div>
            ) : (
              <div className="text-[9px] text-slate-400 font-bold mb-1">No Booking ID</div>
            )}
            {sticker.invoice && (
              <div className="text-[7px] font-bold text-slate-400 mt-0.5 font-mono leading-none">
                Order Invoice: {sticker.invoice}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
