import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, isCheckingOut, setIsCheckingOut, placeOrder } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50" onClick={() => setIsCartOpen(false)} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2"><ShoppingBag size={20} /> আপনার কার্ট</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-slate-500 my-auto">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
              <p>আপনার কার্ট খালি!</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 bg-slate-50 p-3 rounded-xl">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mix-blend-multiply" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                  <div className="text-emerald-600 font-bold text-sm">৳{item.discountedPrice || item.originalPrice}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-colors ml-auto">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-600">সর্বমোট:</span>
              <span className="font-black text-xl text-emerald-600">৳{cartTotal}</span>
            </div>
            {isCheckingOut ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                placeOrder(
                  formData.get('name') as string,
                  formData.get('phone') as string,
                  formData.get('address') as string
                ).then(() => {
                  setIsCheckingOut(false);
                  setIsCartOpen(false);
                  alert('অর্ডার সফল হয়েছে!');
                });
              }} className="flex flex-col gap-3">
                <input required name="name" placeholder="আপনার নাম" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none" />
                <input required name="phone" placeholder="ফোন নম্বর" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none" />
                <textarea required name="address" placeholder="পূর্ণাঙ্গ ঠিকানা" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none h-20 resize-none"></textarea>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
                  অর্ডার কনফার্ম করুন
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                চেকআউট করুন
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
