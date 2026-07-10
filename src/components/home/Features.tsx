import { ShieldCheck, Truck, Tag, Headset } from 'lucide-react';

export default function Features() {
  const features = [
    { icon: <ShieldCheck size={28} strokeWidth={1.5} />, title: "সেরা মানের পণ্য", desc: "নিশ্চিত মানসম্পন্ন পণ্য" },
    { icon: <Truck size={28} strokeWidth={1.5} />, title: "ফাস্ট ডেলিভারি", desc: "২৪ ঘন্টার মধ্যে ডেলিভারি" },
    { icon: <Tag size={28} strokeWidth={1.5} />, title: "সাশ্রয়ী মূল্য", desc: "সেরা দামে সেরা পণ্য" },
    { icon: <Headset size={28} strokeWidth={1.5} />, title: "নির্ভরযোগ্য সেবা", desc: "২৪/৭ কাস্টমার সাপোর্ট" },
  ];

  return (
    <div className="container mx-auto px-4 max-w-[1400px] mb-12 select-none relative z-20">
      <div className="bg-[#f4f8f4] py-6 px-4 md:px-10 rounded-2xl md:rounded-full border border-[#0b3d18]/10 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#0b3d18]/10">
          {features.map((f, i) => (
             <div key={i} className={`flex items-center gap-4 ${i !== 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''}`}>
               <div className="text-[#0b3d18]">
                 {f.icon}
               </div>
               <div className="flex flex-col">
                 <h4 className="text-sm font-black text-gray-900 leading-none mb-1">{f.title}</h4>
                 <p className="text-[11px] font-bold text-gray-600 leading-tight">{f.desc}</p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
