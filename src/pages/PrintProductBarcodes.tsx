import { useEffect, useRef, useState } from 'react';
import Barcode from 'react-barcode';
import { Tag, CalendarDays } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

export default function PrintProductBarcodes() {
  const { products } = useCart();
  const [stockProducts, setStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasPrinted = useRef(false);

  useEffect(() => {
    // Filter products that are in stock
    const searchParams = new URLSearchParams(window.location.search);
    const specificArticle = searchParams.get('article');
    
    let availableProducts = products.filter(p => Number(p.stock || 0) > 0);
    
    if (specificArticle) {
       availableProducts = availableProducts.filter(p => p.article === specificArticle || String(p.id) === specificArticle);
    }
    
    setStockProducts(availableProducts);
    setIsLoading(false);
  }, [products]);

  useEffect(() => {
    if (!isLoading && stockProducts.length > 0 && !hasPrinted.current) {
      // Trigger print after rendering is complete
      const timer = setTimeout(() => {
        hasPrinted.current = true;
        window.print();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, stockProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-bold font-sans text-xs">বারকোড তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    );
  }

  if (stockProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-500 font-black text-lg mb-2">কোনো প্রোডাক্ট পাওয়া যায়নি!</div>
        <p className="text-sm text-slate-500 font-bold font-sans">
          ইনভেন্টরিতে কোনো পণ্য নেই অথবা সার্চ করা আর্টিকেল স্টকে নেই।
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

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="bg-slate-100 min-h-screen print:bg-white text-black font-sans flex flex-col items-center py-8 print:py-0 w-full overflow-y-auto print:block">
      {/* Print styles */}
      <style>{`
        @page {
          size: 4in 4in;
          margin: 0;
        }
        @media print {
          body, html {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .sticker-card {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0.25in !important;
            border-radius: 0 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {stockProducts.map((product, idx) => (
        <div 
          key={idx} 
          className={`sticker-card w-[4in] h-[4in] bg-white border-0 rounded-none mb-4 print:mb-0 p-[0.25in] flex flex-col justify-between items-center box-border relative overflow-hidden ${idx < stockProducts.length - 1 ? "page-break" : ""}`}
        >
          {/* Header MK GROUP */}
          <div className="flex items-center w-full justify-center mt-[2pt]">
             <h1 className="text-[16pt] font-black tracking-[0.2em] text-black uppercase m-0 leading-none">MK GROUP</h1>
          </div>

          {/* Product ID Pill */}
          <div className="flex items-center w-full justify-center mt-[4pt]">
             <div className="bg-black text-white font-black text-[14pt] px-[18pt] py-[4pt] rounded-full tracking-[0.15em] text-center leading-none">
               {product.article || product.id}
             </div>
          </div>

          {/* Price & Date Box */}
          <div className="w-full border-[2pt] border-black rounded-[12pt] flex items-center h-[46pt] overflow-hidden my-[8pt]">
             <div className="flex-1 flex items-center justify-center gap-[6pt] px-[8pt] h-full">
               <Tag size={18} className="fill-transparent stroke-black stroke-[2.5]" />
               <span className="font-extrabold text-[12pt] text-black leading-none whitespace-nowrap">
                  Price: ৳{Math.round((product.discountedPrice || product.originalPrice) / (product.piecesPerBox || 24))}
               </span>
             </div>
             <div className="w-[2pt] h-full bg-black shrink-0"></div>
             <div className="flex-1 flex items-center justify-center gap-[6pt] px-[8pt] h-full">
               <CalendarDays size={18} className="fill-transparent stroke-black stroke-[2.5]" />
               <span className="font-extrabold text-[11pt] text-black uppercase tracking-wider leading-none whitespace-nowrap">
                  ISS: {today}
               </span>
             </div>
          </div>

          {/* Barcode */}
          <div className="flex flex-col items-center justify-center w-full flex-1 min-h-0 overflow-hidden mt-[2pt]">
            {product.article || product.id ? (
              <div className="scale-[1] origin-center flex items-center justify-center h-full">
                <Barcode 
                  value={String(product.article || product.id)} 
                  height={50} 
                  width={1.5} 
                  margin={0} 
                  displayValue={false} 
                />
              </div>
            ) : (
              <div className="text-[10pt] text-slate-400 font-bold mb-[4pt]">No Barcode ID</div>
            )}
          </div>

          {/* Footer Text */}
          <div className="flex items-center w-full justify-center mt-[4pt]">
             <div className="font-black text-[18pt] text-black tracking-[0.15em] leading-none">
               {product.article || product.id}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
