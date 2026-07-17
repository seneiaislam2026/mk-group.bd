import React from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import ImageLoader from './ImageLoader';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative overflow-hidden rounded-xl bg-slate-50">
        {product.isFlashSale && <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">Flash Sale</span>}
        <ImageLoader src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
      </div>
      <div>
        <h3 className="font-bold text-sm text-slate-800 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-black text-emerald-600">৳{product.discountedPrice || product.originalPrice}</span>
          {product.discountedPrice && <span className="text-xs text-slate-400 line-through">৳{product.originalPrice}</span>}
        </div>
      </div>
      <button 
        onClick={() => addToCart(product)}
        className="w-full mt-auto bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingCart size={14} /> কার্টে যোগ করুন
      </button>
    </div>
  );
}
