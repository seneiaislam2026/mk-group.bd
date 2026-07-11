import React, { useState } from 'react';
import { X, ShoppingCart, Heart, ShieldCheck, Truck, Star, Plus, Minus, Share2, CheckCircle } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import ImageLoader from './ImageLoader';

export default function ProductDetailsModal() {
  const { selectedProduct, setSelectedProduct } = useUI();
  const { addToCart, setIsCartOpen, setIsCheckingOut } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null); // optional: close after adding
  };

  const price = selectedProduct.discountedPrice || selectedProduct.originalPrice;
  const discount = selectedProduct.discountedPrice 
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.discountedPrice) / selectedProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl max-h-full overflow-y-auto relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white shadow-sm ring-1 ring-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-gray-50/50 p-8 flex items-center justify-center relative min-h-[300px]">
          {discount > 0 && (
            <span className="absolute top-6 left-6 z-10 bg-primary text-white font-bold px-3 py-1 rounded-lg shadow-sm">
              -{discount}% ছাড়
            </span>
          )}
          <ImageLoader 
            src={selectedProduct.image} 
            alt={selectedProduct.name} 
            className="object-contain mix-blend-multiply max-h-[400px] hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
              {selectedProduct.category}
            </span>
            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md text-xs font-bold">
              <Star className="fill-current" size={12} />
              {selectedProduct.rating} ({selectedProduct.reviews})
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight mb-2">
            {selectedProduct.name}
          </h2>
          <p className="text-gray-500 text-sm mb-4">প্রতি বক্সে: <span className="font-semibold text-slate-700">{selectedProduct.weight}</span></p>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <span className="text-4xl font-extrabold text-primary leading-none">৳{price}</span>
            {selectedProduct.discountedPrice && (
              <span className="text-lg font-medium text-gray-400 line-through decoration-gray-300">৳{selectedProduct.originalPrice}</span>
            )}
          </div>

          <div className="mb-8 text-gray-600 text-sm leading-relaxed">
            {selectedProduct.description || '১০০% অরিজিনাল এবং প্রিমিয়াম পণ্যের নিশ্চয়তা। সেরা মানের পণ্যটি আপনার দোরগোড়ায় পৌঁছে দেওয়া হচ্ছে।'}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white hover:text-secondary hover:shadow-sm rounded-full transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="w-16 text-center text-sm font-bold text-slate-800">{quantity} বক্স</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white hover:text-secondary hover:shadow-sm rounded-full transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Wishlist Icon on Mobile */}
              <button className="sm:hidden w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-500 hover:text-primary hover:bg-red-50 rounded-full transition-colors border border-gray-200">
                <Heart size={20} />
              </button>
            </div>
            
            {/* Direct Buy Button */}
            <button 
              onClick={() => {
                addToCart(selectedProduct, quantity);
                setIsCartOpen(true);
                setIsCheckingOut(true);
                setSelectedProduct(null);
              }}
              className="flex-1 bg-[#2e7d32] text-white py-4 rounded-full text-sm font-extrabold shadow-lg shadow-emerald-700/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-0 cursor-pointer"
            >
              <CheckCircle size={18} />
              সরাসরি কিনুন
            </button>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-secondary text-white py-4 rounded-full text-sm font-extrabold shadow-lg shadow-secondary/20 hover:bg-secondary-light hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-0 cursor-pointer"
            >
              <ShoppingCart size={18} />
              কার্টে যুক্ত করুন
            </button>

            {/* Wishlist Icon on Desktop */}
            <button className="hidden sm:flex w-12 h-12 items-center justify-center bg-gray-50 text-gray-500 hover:text-primary hover:bg-red-50 rounded-full transition-colors border border-gray-200">
              <Heart size={20} />
            </button>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-bold text-slate-700">১০০% অরিজিনাল ও<br/>সেরা মান</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                <Truck size={20} />
              </div>
              <p className="text-xs font-bold text-slate-700">ফাস্ট হোম<br/>ডেলিভারি</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
