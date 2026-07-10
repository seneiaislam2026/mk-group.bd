import React from 'react';
import { Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import ImageLoader from './ImageLoader';

interface ProductCardProps {
  key?: string | number;
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setIsCartOpen, setIsCheckingOut } = useCart();
  const { setSelectedProduct } = useUI();
  
  const discountInPercentage = product.discountedPrice 
    ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-transparent group relative flex flex-col h-full w-full max-w-sm mx-auto mb-8">
      {/* Image Container */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="relative w-full h-[220px] rounded-[20px] overflow-hidden mb-4 cursor-pointer bg-white"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10">
          {product.isNew && (
            <span className="bg-[#111111] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>
        
        <ImageLoader 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Stock Badge */}
        <div className="absolute bottom-4 right-4 z-10">
          <span className="bg-emerald-50/90 backdrop-blur-sm text-[#00693E] text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
            স্টক আছে
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-1">
        {/* Subtitle/Category */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          {product.category}
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-black text-[#111111] leading-tight mb-2 text-center uppercase tracking-wide">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5">
          <Star className="fill-yellow-400 text-yellow-400" size={14} />
          <span className="text-xs font-bold text-slate-600">
            {product.rating} ({product.reviews})
          </span>
        </div>
        
        {/* Price & Discount */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-base font-black text-[#1e3a8a]">
            ৳ {product.discountedPrice ? product.discountedPrice.toLocaleString() : product.originalPrice.toLocaleString()}
          </span>
          {product.discountedPrice && (
            <>
              <span className="text-[11px] font-bold text-slate-400 line-through">
                ৳ {product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded shadow-sm">
                {discountInPercentage}% ছাড়
              </span>
            </>
          )}
        </div>
                
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button 
            onClick={() => setSelectedProduct(product)}
            className="flex items-center justify-center gap-2 bg-blue-50/50 hover:bg-blue-50 text-slate-700 py-3 rounded-full text-xs font-bold transition-colors cursor-pointer"
          >
            <Eye size={16} strokeWidth={2.5} className="text-slate-500" />
            বিবরণ
          </button>
          
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              addToCart(product); 
            }} 
            className="flex items-center justify-center gap-2 bg-[#2e7d32] hover:bg-emerald-700 text-white py-3 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <ShoppingBag size={16} strokeWidth={2.5} />
            কার্টে যোগ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
