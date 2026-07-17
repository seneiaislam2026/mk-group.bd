import { useEffect, useRef, useState } from 'react';
import Barcode from 'react-barcode';
import { useUI } from '../context/UIContext';
import { Product } from '../types';

export default function PrintProductBarcodes() {
  const { products } = useUI();
  const [stockProducts, setStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasPrinted = useRef(false);

  useEffect(() => {
    // Filter products that are in stock
    const availableProducts = products.filter(p => Number(p.stock || 0) > 0);
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
        <div className="text-red-500 font-black text-lg mb-2">কোনো স্টক পাওয়া যায়নি!</div>
        <p className="text-sm text-slate-500 font-bold font-sans">
          ইনভেন্টরিতে স্টকে কোনো পণ্য নেই।
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
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .sticker-card {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 3in !important;
            height: 3in !important;
            border-radius: 0 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {stockProducts.map((product, idx) => (
        <div 
          key={idx} 
          className={`sticker-card w-[3in] h-[3in] bg-white border border-slate-300 shadow-sm rounded mb-4 print:mb-0 p-3 flex flex-col justify-between box-border overflow-hidden ${
            idx < stockProducts.length - 1 ? 'page-break' : ''
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-dashed border-slate-300 pb-2 mb-2 shrink-0">
            <div>
              <h1 className="text-sm font-black tracking-wider text-black leading-tight">MK GROUP</h1>
              <p className="text-[7px] font-bold text-slate-500 leading-tight mt-0.5">
                Savar, Dhaka | 01969317241
              </p>
            </div>
            <div className="text-right">
              <span className="bg-[#2e7d32]/10 text-[#2e7d32] border border-[#2e7d32]/20 px-1.5 py-0.5 rounded text-[8px] font-black uppercase inline-block">
                {product.category || 'PRODUCT'}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-1 text-[10px] text-left overflow-hidden">
            <div className="flex items-start gap-1">
              <span className="font-extrabold text-slate-500 text-[8px] uppercase w-10 shrink-0">Name:</span>
              <span className="font-black text-black leading-tight line-clamp-2">{product.name}</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-extrabold text-slate-500 text-[8px] uppercase w-10 shrink-0">Price:</span>
              <span className="font-black text-black leading-tight">
                ৳{product.discountedPrice || product.originalPrice}
                {product.discountedPrice && product.discountedPrice < product.originalPrice && (
                  <span className="ml-1 text-[8px] line-through text-slate-400">৳{product.originalPrice}</span>
                )}
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-extrabold text-slate-500 text-[8px] uppercase w-10 shrink-0">Weight:</span>
              <span className="font-bold text-slate-800 leading-tight">
                {product.weight || 'N/A'}
              </span>
            </div>
          </div>

          {/* Barcode */}
          <div className="mt-2 pt-2 border-t border-dashed border-slate-300 flex flex-col items-center justify-end shrink-0 h-[45px] overflow-hidden">
            {product.article || product.id ? (
              <div className="scale-[0.85] origin-bottom flex items-end justify-center h-full">
                <Barcode 
                  value={String(product.article || product.id)} 
                  height={32} 
                  width={1.4} 
                  fontSize={11} 
                  margin={0} 
                  displayValue={true} 
                />
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 font-bold mb-1">No Barcode ID</div>
            )}
            <div className="text-[7px] font-bold text-slate-400 mt-1 font-mono leading-none">
              SKU: {product.article || product.id}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
