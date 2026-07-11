import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle, ArrowLeft, Copy, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ImageLoader from './ImageLoader';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal, clearCart, placeOrder, isCheckingOut, setIsCheckingOut } = useCart();
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [successTrackingId, setSuccessTrackingId] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setIsCheckoutSuccess(false);
      setIsCheckingOut(false);
      setSuccessTrackingId('');
      setFormData({ name: '', phone: '', address: '' });
    }, 300);
  };

  const handleCheckoutClick = () => {
    setIsCheckingOut(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingId = placeOrder(formData.name, formData.phone, formData.address);
    setSuccessTrackingId(trackingId);
    setIsCheckoutSuccess(true);
    clearCart();
    // Increase timeout since they need to copy tracking id
    setTimeout(() => {
      handleClose();
    }, 10000);
  };

  const handleCopyTrackingId = () => {
    if (successTrackingId) {
      navigator.clipboard.writeText(successTrackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col translate-x-0 animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {isCheckingOut && !isCheckoutSuccess ? (
              <button onClick={() => setIsCheckingOut(false)} className="mr-1 text-slate-500 hover:text-primary transition-colors">
                <ArrowLeft size={20} />
              </button>
            ) : (
              <ShoppingBag size={20} className="text-secondary" />
            )}
            {isCheckingOut && !isCheckoutSuccess ? 'অর্ডার কনফার্ম করুন' : 'আপনার শপিং কার্ট'}
          </h2>
          <button 
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {isCheckoutSuccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">ধন্যবাদ, {formData.name || 'গ্রাহক'}!</h3>
              <p className="text-sm text-slate-500 max-w-[250px] mb-2">
                আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। খুব শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
              </p>
              <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">আপনার ট্র্যাকিং আইডি</p>
                <div 
                  onClick={handleCopyTrackingId}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                  title="কপি করতে ক্লিক করুন"
                >
                  <span className="text-xl font-black text-primary font-mono tracking-wider">{successTrackingId}</span>
                  {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-400" />}
                </div>
                {copied && <p className="text-[10px] text-emerald-600 font-bold mt-1">কপি করা হয়েছে!</p>}
              </div>
              <button 
                onClick={handleClose}
                className="mt-4 px-8 py-2.5 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
              >
                ওকে
              </button>
            </div>
          ) : isCheckingOut ? (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>মোট বিল:</span>
                  <span>৳{cartTotal}</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">আপনার নাম <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  placeholder="আপনার পুরো নাম লিখুন"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">মোবাইল নাম্বার <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">ডেলিভারি ঠিকানা <span className="text-red-500">*</span></label>
                <textarea 
                  id="address" 
                  name="address" 
                  required 
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                  placeholder="আপনার সম্পূর্ণ ঠিকানা বিস্তারিত লিখুন (বাড়ি নং, রাস্তা, এলাকা)"
                ></textarea>
              </div>
              
              <div className="text-xs text-slate-500 mt-2 flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                <span className="text-primary text-sm mt-0.5">ℹ</span>
                ক্যাশ অন ডেলিভারি - পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন।
              </div>
            </form>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 opacity-70">
              <ShoppingBag size={64} className="text-gray-300" />
              <p className="font-medium text-sm">আপনার কার্ট খালি!</p>
              <button 
                onClick={handleClose}
                className="mt-4 px-6 py-2 bg-secondary text-white rounded-full text-sm font-bold hover:bg-secondary-light transition-colors"
              >
                শপিং চালিয়ে যান
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const price = item.discountedPrice || item.originalPrice;
              return (
                <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative pr-10 group">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageLoader src={item.image} alt={item.name} className="mix-blend-multiply" />
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1">{item.name}</h3>
                    <div className="text-primary font-bold text-sm mb-2">৳{price}</div>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-secondary disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center text-xs font-bold text-slate-800">{item.quantity} বক্স</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-secondary"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute right-3 top-3 text-gray-300 hover:text-red-500 transition-colors bg-white rounded-full p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {!isCheckoutSuccess && cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {!isCheckingOut && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 font-medium">সাবটোটাল</span>
                <span className="text-lg font-extrabold text-slate-800">৳{cartTotal}</span>
              </div>
            )}
            {isCheckingOut ? (
              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-primary text-white py-3.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
              >
                অর্ডার কনফার্ম করুন
              </button>
            ) : (
              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-primary text-white py-3.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
              >
                চেকআউট করুন
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
