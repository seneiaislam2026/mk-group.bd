import { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, Facebook, Instagram, Youtube } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { activeCategory, setActiveCategory, setIsPriceListOpen, setIsOrderTrackingOpen } = useUI();

  const categoriesList = [
    { name: 'জেন্টস ব্যাগ', slug: 'gents-bag' },
    { name: 'ক্যাজুয়াল জুতো', slug: 'casual-shoes' },
    { name: 'স্পোর্টস জুতো', slug: 'sports-shoes' },
    { name: 'ল্যামিজ স্যান্ডেল', slug: 'lamiz-sandals' },
    { name: 'বাচ্চাদের কালেকশন', slug: 'kids-collection' },
    { name: 'ক্রোকারি আইটেম', slug: 'crockery-items' }
  ];

  return (
    <>
      <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <img 
                src="https://i.ibb.co/s9n1g23j/1000095789-removebg-preview.png" 
                alt="এম.কে.গ্রুপ লোগো" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain" 
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-black text-[#00693E] tracking-tight leading-none">এম.কে.গ্রুপ</span>
                <span className="text-[7px] text-white bg-[#00693E] uppercase font-bold mt-0.5 px-1.5 py-0.5 rounded-sm inline-block w-max select-none">
                  ১০০% বিশ্বস্ত ও অরিজিনাল পণ্য
                </span>
              </div>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-5 text-[#00693E]">
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative cursor-pointer flex items-center justify-center transition-all p-1.5 rounded-lg border-2 border-[#00693E]"
            >
              <ShoppingBag size={20} strokeWidth={2.5} />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#00693E] text-white text-[10px] rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            </button>
            <button onClick={() => window.location.hash = '#admin'} className="cursor-pointer">
              <User size={24} strokeWidth={2.5} />
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="cursor-pointer">
              <Menu size={28} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl flex flex-col translate-x-0 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-[#00693E] rounded-full flex items-center justify-center text-white">
                  <ShoppingBag size={18} strokeWidth={2.5} />
                </div>
                <h2 className="text-base font-black text-slate-800">এম.কে.গ্রুপ</h2>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-[#00693E] p-1.5 hover:bg-gray-50 rounded-full transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              <nav>
                <ul className="space-y-0.5">
                  <li>
                    <button 
                      onClick={() => { setActiveCategory(null); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left block px-6 py-3.5 font-black text-sm cursor-pointer transition-colors ${!activeCategory ? 'text-[#00693E] bg-emerald-50/50' : 'text-zinc-700 hover:bg-gray-50'}`}
                    >
                      হোম
                    </button>
                  </li>

                  {/* Order Tracking */}
                  <li>
                    <button 
                      onClick={() => { setIsOrderTrackingOpen(true); setIsMobileMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-6 py-3.5 font-extrabold text-sm text-blue-700 bg-blue-50/50 hover:bg-blue-100/60 duration-200 cursor-pointer border-y border-blue-100"
                    >
                      🚚 অর্ডার ট্র্যাকিং
                    </button>
                  </li>
                  
                  <li>
                    <button 
                      onClick={() => { setIsPriceListOpen(true); setIsMobileMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-6 py-3.5 font-extrabold text-sm text-[#115e59] bg-teal-50 hover:bg-teal-100/60 duration-200 cursor-pointer border-b border-teal-100"
                    >
                      📋 মূল্য তালিকা (স্টক রেট)
                    </button>
                  </li>
                  
                  {/* Category List */}
                  {categoriesList.map((c) => (
                    <li key={c.slug}>
                      <button
                        onClick={() => { setActiveCategory(c.slug); setIsMobileMenuOpen(false); }}
                        className={`w-full text-left px-8 py-3 text-sm font-bold transition-colors cursor-pointer ${activeCategory === c.slug ? 'text-[#00693E] bg-emerald-50/30 font-black' : 'text-zinc-600 hover:bg-gray-50/80'}`}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* My Account bottom footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
              <button 
                onClick={() => { window.location.hash = '#admin'; setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-zinc-700 hover:text-[#00693E] hover:bg-white rounded-xl transition-all font-bold text-sm border border-transparent hover:border-gray-200 shadow-sm bg-white cursor-pointer"
              >
                <User size={18} className="text-zinc-400" />
                <span>আমার অ্যাকাউন্ট</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
