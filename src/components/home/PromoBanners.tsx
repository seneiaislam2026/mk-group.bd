import React from 'react';

const bannerData = [
  {
    title: 'প্রিমিয়াম জেন্টস ব্যাগ',
    subtitle: 'অফিসিয়াল ও ট্রাভেল ব্যাগ',
    btnText: 'ব্যাগ দেখুন',
    btnColor: 'bg-emerald-700 hover:bg-emerald-800',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
    slug: 'gents-bag',
  },
  {
    title: 'আকর্ষণীয় জুতো',
    subtitle: 'নতুন কালেকশন',
    btnText: 'জুতো দেখুন',
    btnColor: 'bg-red-700 hover:bg-red-800',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
    slug: 'casual-shoes',
  },
  {
    title: 'ক্রোকারি আইটেম',
    subtitle: 'কিচেন ও ডাইনিং সেট',
    btnText: 'ক্রোকারি দেখুন',
    btnColor: 'bg-blue-700 hover:bg-blue-800 border-none',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80',
    slug: 'crockery-items',
  }
];

export default function PromoBanners() {
  return (
    <section className="py-6 bg-transparent select-none">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bannerData.map((b, i) => (
            <div 
              key={i} 
              className="relative rounded-3xl overflow-hidden h-44 shadow-sm border border-gray-100 flex items-center p-6 text-white group"
            >
              {/* Back Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent z-10" />
              <img loading="lazy" 
                src={b.image} 
                alt={b.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Text content */}
              <div className="relative z-20 max-w-[65%]">
                <h3 className="text-lg font-black leading-tight tracking-tight text-white mb-1">
                  {b.title}
                </h3>
                <p className="text-zinc-300 text-[11px] font-bold mb-4">{b.subtitle}</p>
                <a 
                  href={`#${b.slug}`}
                  className={`inline-block text-[11px] font-black text-white px-4 py-2 rounded-lg transition-all border border-white/20 hover:border-white shadow-xs ${b.btnColor}`}
                >
                  {b.btnText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
