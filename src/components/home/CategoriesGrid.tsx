import React from 'react';
import { useUI } from '../../context/UIContext';

const visualCategories = [
  {
    name: 'জেন্টস ব্যাগ',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    slug: 'gents-bag',
  },
  {
    name: 'ক্যাজুয়াল জুতো',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80',
    slug: 'casual-shoes',
  },
  {
    name: 'স্পোর্টস জুতো',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
    slug: 'sports-shoes',
  },
  {
    name: 'ল্যামিজ স্যান্ডেল',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80',
    slug: 'lamiz-sandals',
  },
  {
    name: 'বাচ্চাদের কালেকশন',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=300&q=80',
    slug: 'kids-collection',
  },
  {
    name: 'ক্রোকারি আইটেম',
    image: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&w=300&q=80',
    slug: 'crockery-items',
  }
];

export default function CategoriesGrid() {
  const { setActiveCategory } = useUI();

  return (
    <section className="pb-8 pt-4 bg-transparent relative z-10 select-none">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8">
          {visualCategories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setActiveCategory(cat.slug)}
              className="flex flex-col items-center group text-center cursor-pointer w-full"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-slate-800 p-1 mb-3 flex items-center justify-center bg-white shadow-sm overflow-hidden transition-transform group-hover:scale-105 group-hover:border-[#00693E]">
                 <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center relative">
                    <img loading="lazy" 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-[85%] h-[85%] object-cover object-center rounded-full"
                    />
                 </div>
              </div>
              <h3 className="text-xs sm:text-sm font-black text-gray-900 leading-tight group-hover:text-[#00693E] transition-colors">{cat.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
