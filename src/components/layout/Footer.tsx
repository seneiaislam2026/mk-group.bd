import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export default function Footer() {
  const { setIsOrderTrackingOpen } = useUI();

  return (
    <footer className="bg-white border-t border-gray-100 text-slate-800 pt-16 mt-16">
      <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-100">
        
        {/* About */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">M</div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-secondary leading-none">এম.কে.গ্রুপ</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">MK Group</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm">
            এম.কে.গ্রুপ - আপনার বিশ্বস্ত অনলাইন শপিং পার্টনার। আমরা দিচ্ছি ১০০% অরিজিনাল এবং প্রিমিয়াম কোয়ালিটির পণ্য।
          </p>
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com/profile.php?id=61579250185692" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Facebook size={18} className="text-secondary" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Instagram size={18} className="text-secondary" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Youtube size={18} className="text-secondary" />
            </a>
          </div>
        </div>

        {/* Contacts */}
        <div>
          <h3 className="text-sm font-bold text-secondary border-b pb-2 mb-6">যোগাযোগ</h3>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 flex-shrink-0 text-secondary" size={16} />
              <span>পানধোয়া বাজার (জাহাঙ্গীর নগর বিশ্ববিদ্যালয় সংলগ্ন) সেনওয়ালিয়া-১৩৪৪,আশুলিয়া,সাভার,ঢাকা।</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="flex-shrink-0 text-secondary" size={16} />
              <a href="tel:+8801969317241" className="hover:underline hover:text-secondary transition-colors">
                +880 1969-317241
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="flex-shrink-0 text-secondary" size={16} />
              <a href="mailto:mkgroupbd.ltd@gmail.com" className="hover:underline hover:text-secondary transition-colors">
                mkgroupbd.ltd@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-sm font-bold text-secondary border-b pb-2 mb-6">গুরুত্বপূর্ণ লিঙ্ক</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-primary transition-colors">আমাদের সম্পর্কে</a></li>
            <li>
              <button 
                onClick={() => setIsOrderTrackingOpen(true)} 
                className="hover:text-primary transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
              >
                অর্ডার ট্র্যাকিং
              </button>
            </li>
            <li><a href="#" className="hover:text-primary transition-colors">প্রাইভেসি পলিসি</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">রিটার্ন ও রিফান্ড নীতি</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">শর্তাবলী</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-bold text-secondary border-b pb-2 mb-6">নিউজলেটার</h3>
          <p className="text-gray-600 text-sm mb-4">অফার ও আপডেট পেতে সাবস্ক্রাইব করুন</p>
          <div className="flex overflow-hidden relative">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল" 
              className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:border-secondary"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-secondary text-white px-4 rounded-full text-xs font-bold hover:bg-secondary-light transition-colors">
              সাবস্ক্রাইব
            </button>
          </div>
          <div className="mt-6 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
            <p className="text-[10px] text-gray-400 mb-2 text-center uppercase tracking-widest font-bold">পেমেন্ট পার্টনার</p>
            <div className="flex justify-center items-center gap-3">
              <span className="text-[11px] font-black text-[#E2136E] bg-pink-50 px-2 py-1 rounded border border-pink-200 shadow-sm">bKash</span>
              <span className="text-[11px] font-black text-[#F7941D] bg-orange-50 px-2 py-1 rounded border border-orange-200 shadow-sm">Nagad</span>
              <span className="text-[11px] font-black text-[#0d9488] bg-teal-50 px-2 py-1 rounded border border-teal-200 shadow-sm">Bank</span>
            </div>
          </div>
        </div>

      </div>
      <div className="py-4 text-center text-xs font-medium text-gray-400">
        &copy; {new Date().getFullYear()} এম.কে.গ্রুপ। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
