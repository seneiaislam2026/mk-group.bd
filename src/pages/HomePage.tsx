import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/home/HeroSlider';
import CategoriesGrid from '../components/home/CategoriesGrid';
import BestSellers from '../components/home/BestSellers';
import FlashSale from '../components/home/FlashSale';
import PromoBanners from '../components/home/PromoBanners';
import CustomerReviews from '../components/home/CustomerReviews';
import BlogSection from '../components/home/BlogSection';
import ProductCard from '../components/ui/ProductCard';
import { ArrowLeft, Filter, ShoppingBag, ShieldCheck, CreditCard, RefreshCw, Gift } from 'lucide-react';

const getCategoryNameInBangla = (slug: string) => {
  switch (slug) {
    case 'gents-bag': return 'জেন্টস ব্যাগ';
    case 'casual-shoes': return 'ক্যাজুয়াল জুতো';
    case 'sports-shoes': return 'স্পোর্টস জুতো';
    case 'lamiz-sandals': return 'ল্যামিজ স্যান্ডেল';
    case 'kids-collection': return 'বাচ্চাদের কালেকশন';
    case 'crockery-items': return 'ক্রোকারি আইটেম';
    default: return 'পছন্দের পণ্যসমূহ';
  }
};

export default function HomePage() {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useUI();
  const { products } = useCart();

  // Advanced Category & Search matching filter logic
  const filteredProducts = products.filter(product => {
    if (product.isHidden) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(q) || 
             product.category.toLowerCase().includes(q);
    }
    
    if (activeCategory && activeCategory !== 'all') {
      const cat = activeCategory.toLowerCase();
      if (cat === 'gents-bag') {
        return product.category.includes('জেন্টস ব্যাগ') || product.category.includes('ব্যাগ');
      }
      if (cat === 'casual-shoes') {
        return product.category.includes('ক্যাজুয়াল জুতো') || product.category.includes('জুতো');
      }
      if (cat === 'sports-shoes') {
        return product.category.includes('স্পোর্টস জুতো');
      }
      if (cat === 'lamiz-sandals') {
        return product.category.includes('ল্যামিজ স্যান্ডেল') || product.category.includes('স্যান্ডেল');
      }
      if (cat === 'kids-collection') {
        return product.category.includes('বাচ্চাদের কালেকশন') || product.category.includes('বাচ্চাদের');
      }
      if (cat === 'crockery-items') {
        return product.category.includes('ক্রোকারি আইটেম') || product.category.includes('ক্রোকারি');
      }
    }
    return true;
  });

  const isBrowsingCatalog = activeCategory !== null || searchQuery !== '';

  return (
    <div className="min-h-screen font-sans bg-[#f8fafc]">
      {isBrowsingCatalog ? (
        /* Catalog/Search Filter landing layout */
        <div className="container mx-auto px-4 max-w-[1400px] py-8 select-none">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-6">
            <button onClick={() => { setActiveCategory(null); setSearchQuery(''); }} className="hover:text-[#0b3d18] cursor-pointer">হোম</button>
            <span>/</span>
            {searchQuery ? (
              <span className="text-[#0b3d18] font-black">অনুসন্ধান ফলাফল: "{searchQuery}"</span>
            ) : (
              <span className="text-[#0b3d18] font-black">ক্যাটাগরি: {getCategoryNameInBangla(activeCategory || '')}</span>
            )}
          </div>

          <div className="flex flex-col gap-8 items-start">
            {/* Catalog Grid results area */}
            <div className="w-full">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200/60">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 leading-none">
                    {searchQuery ? `"${searchQuery}" এর অনুসন্ধান ফলাফল` : getCategoryNameInBangla(activeCategory || '')}
                  </h1>
                  <p className="text-sm text-gray-500 font-bold mt-2">
                    মোট {filteredProducts.length} টি পণ্য পাওয়া গেছে
                  </p>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* Beautiful empty state */
                <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center max-w-2xl mx-auto my-12 shadow-sm">
                  <div className="w-24 h-24 bg-red-50 border-2 border-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">দুঃখিত, কোনো পণ্য পাওয়া যায়নি!</h2>
                  <p className="text-sm text-gray-500 font-bold mb-8">আপনার টাইপকৃত কীওয়ার্ডটি আবার যাচাই করুন অথবা নিচের জনপ্রিয় ক্যাটাগরিগুলো ব্রাউজ করুন।</p>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { name: 'জেন্টস ব্যাগ', slug: 'gents-bag' },
                      { name: 'ক্যাজুয়াল জুতো', slug: 'casual-shoes' },
                      { name: 'স্পোর্টস জুতো', slug: 'sports-shoes' },
                      { name: 'ল্যামিজ স্যান্ডেল', slug: 'lamiz-sandals' }
                    ].map(tag => (
                      <button
                        key={tag.slug}
                        onClick={() => { setActiveCategory(tag.slug); setSearchQuery(''); }}
                        className="bg-zinc-100 hover:bg-[#f0f7f2] hover:text-[#0b3d18] text-gray-700 text-sm font-black px-6 py-3 rounded-full transition-all cursor-pointer"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Regular Home Layout matches template */
        <div className="w-full">
          <h1 className="sr-only">এম.কে.গ্রুপ - ফ্রেশ ও নিরাপদ গ্রোসারি</h1>
          <HeroSlider />
          <CategoriesGrid />
          
          <section className="container mx-auto px-4 py-8">
            <h2 className="sr-only">জনপ্রিয় পণ্যসমূহ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {products.filter(p => !p.isHidden).slice(0, 6).map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
