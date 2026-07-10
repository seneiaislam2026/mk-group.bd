import { Search, MapPin } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export default function HeroSlider() {
  const { searchQuery, setSearchQuery } = useUI();

  return (
    <div className="container mx-auto px-4 md:px-6 mb-8 select-none">
      {/* 64 District Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#e6f4ea]/40 to-transparent flex items-center justify-between px-6 py-8 mt-2 border-b border-gray-100">
        <div className="flex flex-col z-10 w-full items-center text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-5xl font-black text-[#00693E]">64</span>
            <div className="flex flex-col justify-center items-start text-left">
              <span className="text-sm font-black text-[#dc2626] tracking-wider leading-none">HOME</span>
              <span className="text-sm font-black text-[#dc2626] tracking-wider leading-none mt-1">DELIVERY</span>
            </div>
          </div>
          <span className="text-xs font-black text-[#00693E] tracking-[0.2em] mt-1">DISTRICT</span>
          <p className="text-xs md:text-sm font-bold text-[#00693E] mt-4 max-w-xs text-center">প্রোডাক্ট চেক করে রিসিভ করার সুবিধাতো থাকছেই</p>
        </div>
        
        {/* Placeholder Graphic for Banner matching the screenshot */}
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 z-0 hidden lg:block opacity-80">
          <div className="relative">
             <div className="w-24 h-12 bg-amber-100/80 rounded-lg flex items-center justify-center border-2 border-amber-200">
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#00693E]"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                </div>
             </div>
             <div className="absolute -top-3 -right-2 w-7 h-7 bg-[#00693E] text-white rounded-full flex items-center justify-center shadow border-2 border-white">
                <MapPin size={12} strokeWidth={3} />
             </div>
          </div>
        </div>
        
        {/* Decorative background shape */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#e6f4ea] rounded-full filter blur-3xl opacity-50 z-[-1]"></div>
      </div>

      {/* Search Bar - Mockup Style */}
      <div className="mt-6 flex justify-center w-full lg:hidden relative z-20">
        <div className="w-full relative group">
          <input 
            type="text" 
            placeholder="পছন্দের জুতো বা ক্রোকারি পণ্য খুঁজুন" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-12 py-3.5 bg-white border border-gray-200 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00693E]/20 focus:border-[#00693E] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00693E] hover:text-[#005030] transition-colors cursor-pointer">
            <Search size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
