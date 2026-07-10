import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import ImageLoader from '../ui/ImageLoader';
import { ShoppingCart } from 'lucide-react';

const dealProducts = [
  {
    id: 'deal-1',
    name: 'রুই মাছ (মাঝারি)',
    originalPrice: 400,
    discountedPrice: 320,
    weight: '১ কেজি (প্রায়)',
    image: 'https://images.unsplash.com/photo-1544378730-8b5afcbce3eb?auto=format&fit=crop&w=300&q=80',
    category: 'মাছ',
    rating: 4.8,
    reviews: 80,
    discount: '-20%',
  },
  {
    id: 'deal-2',
    name: 'গরুর মাংস (হাড়ছাড়া)',
    originalPrice: 800,
    discountedPrice: 680,
    weight: '১ কেজি',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=300&q=80',
    category: 'মাংস',
    rating: 4.9,
    reviews: 121,
    discount: '-15%',
  },
  {
    id: 'deal-3',
    name: 'চিকেন ব্রেস্ট',
    originalPrice: 200,
    discountedPrice: 165,
    weight: '৫০০ গ্রাম',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300&q=80',
    category: 'মুরগি',
    rating: 4.7,
    reviews: 64,
    discount: '-18%',
  },
  {
    id: 'deal-4',
    name: 'চিংড়ি (বড় সাইজ)',
    originalPrice: 500,
    discountedPrice: 450,
    weight: '৫০০ গ্রাম',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=300&q=80',
    category: 'মাছ',
    rating: 4.8,
    reviews: 95,
    discount: '-10%',
  },
  {
    id: 'deal-5',
    name: 'এক্সক্লুসিভ জেন্টস ব্যাগ',
    originalPrice: 90,
    discountedPrice: 80,
    weight: '১ লিটার',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80',
    category: 'দুধ ও দুগ্ধজাত পণ্য',
    rating: 4.9,
    reviews: 44,
    discount: '-12%',
  }
];

export default function FlashSale() {
  const { addToCart } = useCart();
  const { setSelectedProduct } = useUI();

  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 14,
    seconds: 32
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 14, seconds: 32 }; // Reset to match screenshot design loop
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 bg-transparent select-none">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Today's Deal block matches mockup precisely with special discount percentage/countdown */}
          <div className="lg:col-span-3 bg-[#e8f5e9] rounded-3xl p-6 border border-emerald-150 flex flex-col items-center text-center relative overflow-hidden h-full shadow-xs justify-between min-h-[385px]">
            {/* Soft decorative background badge */}
            <div className="absolute top-4 right-4 bg-[#ff6f00] text-white p-2.5 rounded-2xl font-black text-xl flex items-center justify-center shadow-md">
              %
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-black text-[#1b4332] leading-tight tracking-tight">আজকের ডিল</h2>
              <p className="text-zinc-650 text-xs font-bold mt-1">সেরা দামে সেরা পণ্য</p>
            </div>

            {/* Countdown widgets */}
            <div className="my-8 w-full">
              <div className="flex gap-2.5 justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="bg-white text-[#1b4332] px-3.5 py-2.5 rounded-xl text-lg font-black shadow-sm border border-emerald-100">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-zinc-600 font-bold mt-1">ঘণ্টা</span>
                </div>
                <span className="text-emerald-800 font-black text-lg -translate-y-3">:</span>
                <div className="flex flex-col items-center">
                  <div className="bg-white text-[#1b4332] px-3.5 py-2.5 rounded-xl text-lg font-black shadow-sm border border-emerald-100">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-zinc-600 font-bold mt-1">মিনিট</span>
                </div>
                <span className="text-emerald-800 font-black text-lg -translate-y-3">:</span>
                <div className="flex flex-col items-center">
                  <div className="bg-white text-[#1b4332] px-3.5 py-2.5 rounded-xl text-lg font-black shadow-sm border border-[#1b4332]/20 animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-zinc-600 font-bold mt-1">সেকেন্ড</span>
                </div>
              </div>
            </div>

            {/* CTA Green button */}
            <button className="w-full bg-[#1b4332] hover:bg-[#153427] text-white py-3 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer">
              সব ডিল দেখুন
            </button>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
              {dealProducts.map(product => {
                const discountVal = product.discount;
                return (
                  <div 
                    key={product.id}
                    onClick={() => setSelectedProduct(product as any)}
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 group relative flex flex-col h-full cursor-pointer"
                  >
                    {/* Discount badge top-left */}
                    <span className="absolute top-4 left-4 z-10 bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-lg shadow-sm">
                      {discountVal}
                    </span>

                    {/* Image display */}
                    <div className="h-32 w-full overflow-hidden bg-gray-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#1b4332]/5 transition-colors duration-300 relative">
                      <ImageLoader 
                        src={product.image} 
                        alt={product.name} 
                        className="group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-[13px] font-black text-slate-800 leading-snug line-clamp-1 group-hover:text-[#1b4332] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-bold mt-0.5 mb-2">{product.weight}</p>

                      {/* Prices & cart btn */}
                      <div className="mt-auto flex items-center justify-between gap-1.5 pt-2 border-t border-gray-150">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-450 line-through font-bold">৳{product.originalPrice}</span>
                          <span className="text-[14px] font-extrabold text-[#1b4332] leading-none mt-0.5">৳{product.discountedPrice}</span>
                        </div>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            addToCart(product as any); 
                          }} 
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-[#1b4332] hover:bg-[#1b4332] hover:text-white transition-all shadow-xs cursor-pointer flex-shrink-0"
                          title="কার্টে যোগ করুন"
                        >
                          <ShoppingCart size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
