import React, { useState } from 'react';
import { X, Search, Printer, Download, ShoppingCart, Filter, Eye } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';

export default function PriceListModal() {
  const { isPriceListOpen, setIsPriceListOpen, setSelectedProduct } = useUI();
  const { products, addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isPriceListOpen) return null;

  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products based on search & category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    // Standard BOM for proper formatting in Excel (especially with Bangla text)
    const BOM = '\uFEFF';
    const csvHeaders = 'পণ্য আইডি,পণ্যের নাম,ক্যাটাগরি,ওজন,নিয়মিত মূল্য (৳),বর্তমান মূল্য (৳)\n';
    
    const csvRows = filteredProducts.map(product => {
      const name = product.name.replace(/"/g, '""');
      const category = product.category.replace(/"/g, '""');
      const weight = product.weight.replace(/"/g, '""');
      const regPrice = product.originalPrice;
      const currentPrice = product.discountedPrice || product.originalPrice;
      return `"${product.id}","${name}","${category}","${weight}",${regPrice},${currentPrice}`;
    }).join('\n');
    
    const blob = new Blob([BOM + csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Nirapod_Khaddo_Shomvar_Price_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPriceText = (product: any) => {
    const text = `${product.name} (${product.weight}) - মূল্য: ৳${product.discountedPrice || product.originalPrice}`;
    navigator.clipboard.writeText(text);
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-10 print:static print:inset-auto print:p-0">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
        onClick={() => setIsPriceListOpen(false)}
      />

      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] sm:h-[80vh] flex flex-col relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl overflow-hidden print:static print:h-auto print:w-full print:shadow-none print:rounded-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0 print:border-b-2 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-bold print:hidden">
              📋
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-[#1b4332] tracking-tight leading-tight">
                এম.কে.গ্রুপ - মূল্য তালিকা
              </h2>
              <p className="text-xs text-zinc-500 font-bold mt-1 print:text-black">
                সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsPriceListOpen(false)}
            className="w-10 h-10 bg-gray-50 shadow-sm ring-1 ring-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 print:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar (Hidden when printing) */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0 print:hidden">
          {/* Left: Interactive search & Filter dropdown */}
          <div className="flex flex-1 flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="পণ্য ক্যাটাগরি বা নাম দিয়ে খুঁজুন..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#1b4332] font-semibold text-gray-800"
              />
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#1b4332] font-semibold text-gray-700 appearance-none cursor-pointer"
              >
                <option value="all">সব ক্যাটাগরি</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2 justify-end">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 bg-sky-50 border border-sky-100 hover:bg-sky-100 text-sky-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Printer size={14} /> প্রিন্ট করুন
            </button>
            <button 
              onClick={handleDownloadCSV}
              className="flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Download size={14} /> ডাউনলোড (CSV)
            </button>
          </div>
        </div>

        {/* Content Table/Cards area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 print:overflow-visible print:p-0">
          
          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden print:block print:border-none print:rounded-none">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-semibold">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[11px] sm:text-xs uppercase tracking-wider text-slate-500 print:bg-gray-100 print:text-black">
                  <th className="p-3 sm:p-4 text-left">পণ্যের নাম</th>
                  <th className="p-3 sm:p-4 text-left">ক্যাটাগরি</th>
                  <th className="p-3 sm:p-4 text-left">ওজন / ইউনিট</th>
                  <th className="p-3 sm:p-4 text-right">নিয়মিত মূল্য</th>
                  <th className="p-3 sm:p-4 text-right">বর্তমান মূল্য</th>
                  <th className="p-3 sm:p-4 text-center print:hidden">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                      কোন পণ্যের তথ্য পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const hasDiscount = !!product.discountedPrice;
                    const finalPrice = product.discountedPrice || product.originalPrice;
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors print:hover:bg-transparent">
                        <td className="p-3 sm:p-4">
                          <div className="font-extrabold text-[#1b4332] text-sm sm:text-base leading-snug">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            {product.isFlashSale && (
                              <span className="bg-red-50 text-red-600 px-1.5 py-0.2 rounded text-[9px] font-bold">
                                অফার
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-slate-500 font-medium">{product.category}</td>
                        <td className="p-3 sm:p-4 text-slate-600 font-bold">{product.weight}</td>
                        <td className="p-3 sm:p-4 text-right text-gray-400 line-through font-normal">
                          {hasDiscount ? `৳${product.originalPrice}` : '-'}
                        </td>
                        <td className="p-3 sm:p-4 text-right text-base font-black text-[#1b4332] print:text-black">
                          ৳{finalPrice}
                        </td>
                        <td className="p-3 sm:p-4 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsPriceListOpen(false);
                              }}
                              className="text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="বিস্তারিত দেখুন"
                            >
                              <Eye size={15} />
                            </button>
                            
                            <button 
                              onClick={() => copyPriceText(product)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${copiedId === product.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'}`}
                            >
                              {copiedId === product.id ? 'কপি হয়েছে' : 'কপি করুন'}
                            </button>
 
                            <button 
                              onClick={() => addToCart(product, 1)}
                              className="flex items-center gap-1 bg-[#1b4332] hover:bg-[#153527] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <ShoppingCart size={12} /> কার্ট
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (shown on mobile, hidden on desktop/print) */}
          <div className="block md:hidden space-y-3.5 print:hidden">
            {filteredProducts.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 font-bold border border-slate-100">
                কোন পণ্যের তথ্য পাওয়া যায়নি।
              </div>
            ) : (
              filteredProducts.map((product) => {
                const hasDiscount = !!product.discountedPrice;
                const finalPrice = product.discountedPrice || product.originalPrice;
                return (
                  <div key={product.id} className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    {/* Header: Title & weight */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-800 text-sm leading-snug">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="bg-emerald-50 text-[#00693E] px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100/40">
                            {product.category}
                          </span>
                          <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-100">
                            {product.weight}
                          </span>
                          {product.isFlashSale && (
                            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-100/30">
                              অফার
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Price Tag */}
                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-[#00693E]">
                          ৳{finalPrice}
                        </div>
                        {hasDiscount && (
                          <div className="text-[10px] text-slate-400 line-through font-bold mt-0.5">
                            ৳{product.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-dashed border-gray-150">
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsPriceListOpen(false);
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-150 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="বিস্তারিত দেখুন"
                        >
                          <Eye size={14} />
                        </button>
                        
                        <button 
                          onClick={() => copyPriceText(product)}
                          className={`h-8 px-2.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${copiedId === product.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-gray-50 border-gray-150 hover:bg-gray-200 text-slate-600'}`}
                        >
                          {copiedId === product.id ? 'কপি হয়েছে' : 'কপি করুন'}
                        </button>
                      </div>

                      <button 
                        onClick={() => addToCart(product, 1)}
                        className="flex items-center gap-1 bg-[#00693E] hover:bg-[#005030] text-white px-3.5 py-1.8 rounded-xl text-xs font-black shadow-md shadow-emerald-700/10 active:scale-95 transition-all cursor-pointer"
                      >
                        <ShoppingCart size={13} /> কার্টে যুক্ত করুন
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
