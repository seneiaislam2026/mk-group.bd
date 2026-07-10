import React from 'react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import ImageLoader from '../ui/ImageLoader';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const bestSellerProducts = [
  {
    id: 'bs-1',
    name: 'কই মাছ (প্রতি কেজি)',
    originalPrice: 360,
    discountedPrice: 320,
    discountLabel: '10% ছাড়',
    weight: '১ কেজি',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=400&q=80',
    category: 'মাছ',
    rating: 4.8,
    reviews: 140,
  },
  {
    id: 'bs-2',
    name: 'চিকেন ব্রেস্ট (প্রতি কেজি)',
    originalPrice: 480,
    discountedPrice: 420,
    discountLabel: '12% ছাড়',
    weight: '১ কেজি',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
    category: 'মুরগি',
    rating: 4.9,
    reviews: 210,
  },
  {
    id: 'bs-3',
    name: 'গরুর লাল মাংস (প্রতি কেজি)',
    originalPrice: 800,
    discountedPrice: 680,
    discountLabel: '15% ছাড়',
    weight: '১ কেজি',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
    category: 'মাংস',
    rating: 4.7,
    reviews: 88,
  },
  {
    id: 'bs-4',
    name: 'দেশি ডিম (হাফ ডজন)',
    originalPrice: 78,
    discountedPrice: 70,
    discountLabel: '10% ছাড়',
    weight: '৬ পিস',
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=400&q=80',
    category: 'ডিম',
    rating: 4.9,
    reviews: 350,
  },
  {
    id: 'bs-5',
    name: 'সালমন ফিলেট (প্রতি কেজি)',
    originalPrice: 1030,
    discountedPrice: 950,
    discountLabel: '8% ছাড়',
    weight: '১ কেজি',
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=400&q=80',
    category: 'মাছ',
    rating: 4.8,
    reviews: 175,
  }
];

export default function BestSellers() {
  const { addToCart } = useCart();
  const { setSelectedProduct } = useUI();

  return (
    <section className="py-6 bg-transparent select-none pb-12 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200/60">
          <h2 className="text-2xl font-black text-gray-900 leading-none">সেরা সেলার</h2>
          <button onClick={() => window.scrollTo(0,0)} className="flex items-center gap-2 text-sm font-bold text-[#0b3d18] hover:text-[#072a10] hover:underline cursor-pointer">
            সব পণ্য দেখুন <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* 5 columns grid matching the screenshot */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {bestSellerProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => setSelectedProduct(product as any)}
              className="bg-zinc-50/50 rounded-2xl border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#0b3d18]/20 transition-all duration-300 group relative flex flex-col h-full cursor-pointer overflow-hidden p-0"
            >
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-20 bg-[#0b3d18] text-white px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm">
                {product.discountLabel}
              </div>

              {/* Product Layout */}
              <div className="p-5 pt-8 flex-1 flex flex-col">
                 <div className="w-full aspect-[5/4] mb-4 relative flex items-center justify-center">
                    <ImageLoader 
                      src={product.image} 
                      alt={product.name} 
                      className="w-[85%] h-[85%] object-cover rounded-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                 </div>
                 
                 <h3 className="text-[15px] font-black text-gray-900 leading-snug group-hover:text-[#0b3d18] transition-colors mt-auto pt-2">
                   {product.name}
                 </h3>
              </div>

              {/* Price & Add to Cart Footer */}
              <div className="px-5 pb-5 pt-1 mt-auto flex items-end justify-between">
                <div className="flex items-center gap-2">
                   <span className="text-[17px] font-black text-[#0b3d18]">৳ {product.discountedPrice}</span>
                   <span className="text-xs font-bold text-gray-400 line-through">৳ {product.originalPrice}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product as any); }} 
                  className="w-10 h-10 rounded-xl bg-[#0b3d18] text-white hover:bg-[#072a10] hover:-translate-y-1 transition-all flex items-center justify-center cursor-pointer shadow-md"
                  title="কার্টে যোগ করুন"
                >
                  <ShoppingCart size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
