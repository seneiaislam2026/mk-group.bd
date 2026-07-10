import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Star, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Check, 
  AlertCircle,
  Copy
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import ImageLoader from '../components/ui/ImageLoader';

interface ProductLandingPageProps {
  productId: string;
  onBack: () => void;
}

export default function ProductLandingPage({ productId, onBack }: ProductLandingPageProps) {
  const { products, placeDirectOrder } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  
  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);
  const [trackingCopied, setTrackingCopied] = useState(false);

  const handleCopyTrackingId = () => {
    if (placedOrderDetails?.trackingId) {
      navigator.clipboard.writeText(placedOrderDetails.trackingId);
      setTrackingCopied(true);
      setTimeout(() => setTrackingCopied(false), 2000);
    }
  };

  // Find the target product from the stateful products list
  const product = products.find(p => p.id === productId);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <Helmet>
          <title>পণ্যটি খুঁজে পাওয়া যায়নি | এম.কে.গ্রুপ</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-xl font-black text-slate-800 mb-2">দুঃখিত! পণ্যটি খুঁজে পাওয়া যায়নি</h1>
        <p className="text-sm text-slate-500 font-bold mb-6">লিঙ্কটি ভুল হতে পারে অথবা পণ্যটি মুছে ফেলা হয়েছে।</p>
        <button 
          onClick={onBack}
          className="bg-[#1b4332] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-emerald-900 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft size={14} /> স্টোরে ফিরে যান
        </button>
      </div>
    );
  }

  const price = product.discountedPrice || product.originalPrice;
  const originalPrice = product.originalPrice;
  const hasDiscount = !!product.discountedPrice;
  const discountAmount = hasDiscount ? originalPrice - price : 0;
  const discountPercent = hasDiscount ? Math.round((discountAmount / originalPrice) * 100) : 0;
  const totalPrice = price * quantity;

  // Copy shareable link
  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/#product=${product.id}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {
        // Fallback
        const el = document.createElement('textarea');
        el.value = link;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    } else {
      // Fallback
      const el = document.createElement('textarea');
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Convert number to Bengali
  const toBanglaNumber = (num: number | string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    if (!phone.trim()) {
      setFormError('অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন।');
      return;
    }
    if (phone.trim().length < 11) {
      setFormError('মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে।');
      return;
    }
    if (!address.trim()) {
      setFormError('অনুগ্রহ করে আপনার ডেলিভারি ঠিকানা লিখুন।');
      return;
    }

    // Submit direct order using context
    const trackingId = placeDirectOrder(customerName.trim(), phone.trim(), address.trim(), product, quantity);

    setPlacedOrderDetails({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      productName: product.name,
      quantity,
      price,
      total: totalPrice,
      trackingId
    });

    setOrderSuccess(true);
    
    // Clear form state
    setCustomerName('');
    setPhone('');
    setAddress('');
    setQuantity(1);
  };

  const metaTitle = `${product.name} | এম.কে.গ্রুপ`;
  const metaDescription = `${product.name} অনলাইনে অর্ডার করুন এম.কে.গ্রুপ থেকে। ১০০% খাঁটি, ফ্রেশ ও কেমিক্যালমুক্ত। ক্যাশ অন ডেলিভারিতে সারাদেশে ডেলিভারি!`;
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/#product=${product.id}` : `https://www.nirapodkhaddoshomvar.com/#product=${product.id}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${product.name}, ${product.category}, buy online bangladesh, fresh food, safe food`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={product.image} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={productUrl} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={product.image} />

        {/* Product Schema JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.image,
            "description": metaDescription,
            "sku": product.id,
            "offers": {
              "@type": "Offer",
              "url": productUrl,
              "priceCurrency": "BDT",
              "price": price,
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
      
      {/* Landing Page Action Bar / Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sticky top-0 z-50 shadow-sm select-none">
        <div className="container mx-auto max-w-[1200px] flex items-center justify-between gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-black text-slate-700 hover:text-[#1b4332] bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft size={15} /> স্টোরে ফিরে যান
          </button>
          
          <div className="text-center">
            <span className="text-base sm:text-lg font-extrabold text-[#1b4332] tracking-tight leading-none">এম.কে.গ্রুপ</span>
          </div>

          <button 
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-sm ${
              copied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#1b4332] text-white hover:bg-emerald-800'
            }`}
            title="ফেসবুক এডের জন্য লিঙ্ক কপি করুন"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copied ? 'কপি হয়েছে!' : 'লিঙ্ক কপি করুন (FB Ad)'}</span>
          </button>
        </div>
      </div>

      {/* Success View */}
      {orderSuccess ? (
        <div className="container mx-auto px-4 py-12 max-w-xl animate-in zoom-in-95 duration-300">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 animate-bounce">
              <CheckCircle2 size={44} />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 leading-tight">আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!</h1>
            <p className="text-sm text-slate-500 font-bold mb-6">আমাদের একজন প্রতিনিধি খুব শীঘ্রই আপনার মোবাইল নম্বরে কল করে অর্ডারটি কনফার্ম করবেন।</p>
            
            {/* Quick Order Invoice Invoice */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 text-left text-xs sm:text-sm font-bold text-slate-700 mb-8 space-y-2.5">
              <div className="border-b border-dashed border-slate-200 pb-2 flex items-center justify-between">
                <span className="text-slate-400">অর্ডার স্টেটাস:</span>
                <span className="bg-[#e8f5e9] text-[#2e7d32] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">নতুন অর্ডার</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">ট্র্যাকিং আইডি:</span>
                <div className="flex flex-col items-end gap-1">
                  <div 
                    onClick={handleCopyTrackingId}
                    className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-colors group"
                    title="কপি করতে ক্লিক করুন"
                  >
                    <span className="text-[#2e7d32] font-black font-mono">{placedOrderDetails?.trackingId}</span>
                    {trackingCopied ? <Check size={14} className="text-[#2e7d32]" /> : <Copy size={14} className="text-[#2e7d32] opacity-50 group-hover:opacity-100" />}
                  </div>
                  {trackingCopied && <span className="text-[10px] text-emerald-600 font-bold">কপি করা হয়েছে!</span>}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পণ্যর নাম:</span>
                <span className="text-slate-800 text-right">{placedOrderDetails?.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পরিমাণ (ওজন):</span>
                <span className="text-slate-800">{placedOrderDetails?.quantity} টি ({product.weight})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">মোট মূল্য:</span>
                <span className="text-slate-900 font-black text-base text-primary">৳ {placedOrderDetails?.total}</span>
              </div>
              <div className="border-t border-dashed border-slate-200 pt-2.5 space-y-1 text-[11px] sm:text-xs">
                <div><span className="text-slate-400">গ্রাহক নাম:</span> {placedOrderDetails?.customerName}</div>
                <div><span className="text-slate-400">মোবাইল নম্বর:</span> {placedOrderDetails?.phone}</div>
                <div><span className="text-slate-400">ডেলিভারি ঠিকানা:</span> {placedOrderDetails?.address}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button 
                onClick={() => setOrderSuccess(false)}
                className="w-full sm:w-auto bg-[#1b4332] text-white px-8 py-3 rounded-xl text-xs font-black shadow-lg shadow-emerald-900/10 hover:bg-emerald-800 hover:-translate-y-0.5 transition-all"
              >
                আরো অর্ডার করুন
              </button>
              <button 
                onClick={onBack}
                className="w-full sm:w-auto bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 px-8 py-3 rounded-xl text-xs font-black transition-all"
              >
                হোমপেজে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-[1200px]">
          
          {/* Urgent Promo Message for Ad Campaigns */}
          <div className="bg-[#1b4332]/5 border border-[#1b4332]/20 rounded-2xl p-4 flex items-center justify-between gap-4 mb-8 select-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1b4332] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#1b4332]">ফেসবুক ধামাকা অফার!</h4>
                <p className="text-[11px] text-gray-500 font-bold mt-0.5">আজ অর্ডার করলেই পাচ্ছেন বিশেষ ছাড় এবং ফাস্ট ক্যাশ অন ডেলিভারি সুবিধা।</p>
              </div>
            </div>
            {hasDiscount && (
              <span className="bg-rose-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shrink-0">
                {toBanglaNumber(discountPercent)}% ছাড়!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Product Visuals & Trust (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Product Card Details */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 md:p-8 flex flex-col">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2 select-none">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1b4332] bg-[#1b4332]/10 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-50/80 px-3 py-1 rounded-full text-xs font-black">
                    <Star className="fill-current" size={13} />
                    {product.rating} ({toBanglaNumber(product.reviews)} কাস্টমার রিভিউ)
                  </div>
                </div>

                <h1 className="text-2xl md:text-3.5xl font-black text-slate-800 leading-tight mb-2">
                  {product.name}
                </h1>
                
                <p className="text-gray-500 font-bold text-xs md:text-sm mb-6">
                  প্যাকেজ সাইজ (ওজন): <span className="text-[#1b4332] font-black">{product.weight}</span>
                </p>

                {/* Big Image Representation */}
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-slate-100/70 rounded-3xl p-6 flex items-center justify-center relative aspect-square max-h-[460px] mb-6 overflow-hidden">
                  {hasDiscount && (
                    <span className="absolute top-4 left-4 z-10 bg-rose-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md">
                      {toBanglaNumber(discountPercent)}% ডিসকাউন্ট
                    </span>
                  )}
                  <ImageLoader 
                    src={product.image} 
                    alt={product.name} 
                    className="object-contain mix-blend-multiply max-h-[380px] w-full hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Urgency Counter Notification */}
                <div className="border border-dashed border-slate-200 bg-slate-50/50 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600 mb-6 select-none">
                  <span className="flex items-center gap-1 text-slate-500"><Clock size={14} className="text-[#1b4332]" /> স্টক লিমিটেড!</span>
                  <span className="text-[#1b4332] font-black bg-[#1b4332]/10 px-2.5 py-1 rounded-md">আজ শেষ সুযোগ</span>
                </div>

                {/* Custom Long Description for food items to boost sales page conversion */}
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-sm select-none">কেন এম.কে.গ্রুপ-এর পণ্য সেরা?</h3>
                  <p>
                    আমাদের প্রতিটি খাদ্যপণ্য ১০০% নিরাপদ এবং বিশুদ্ধতার নিশ্চয়তা দেয়। সরাসরি গ্রামীণ খামার থেকে কঠোর স্বাস্থ্যবিধি মেনে, ভেজালহীন ও স্বাস্থ্যসম্মত উপায়ে এটি সংগ্রহ ও প্রক্রিয়াজাত করা হয়।
                  </p>
                  <p>
                    আমরা কোনো কৃত্রিম প্রিজারভেটিভ বা ক্ষতিকারক কেমিক্যাল ব্যবহার করি না। আপনার পরিবারের সুস্বাস্থ্য ও পুষ্টি নিশ্চিত করার জন্য আমাদের পণ্যই বিশ্বস্ত সমাধান। আমাদের ফাস্ট হোম ডেলিভারির মাধ্যমে একদম তাজা পণ্য পৌঁছে যাবে আপনার ঘরে।
                  </p>
                </div>

                {/* Social Proof */}
                <div className="mt-8 pt-6 border-t border-gray-100 select-none">
                  <div className="bg-[#e8f5e9]/60 p-4 rounded-2xl border border-emerald-50 flex items-center gap-3">
                    <span className="text-xl">🔥</span>
                    <p className="text-xs font-extrabold text-[#115e5a] leading-tight">
                      আজকে ইতোমধ্যে ১৭ জন গ্রাহক এটি অর্ডার করেছেন এবং ১০০% সন্তুষ্ট হয়েছেন।
                    </p>
                  </div>
                </div>

              </div>

              {/* Safety Badges & Trust Seals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
                {[
                  { title: '১০০% হালাল ও নিরাপদ', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
                  { title: 'ফাস্ট হোম ডেলিভারি', icon: Truck, color: 'text-blue-600 bg-blue-50' },
                  { title: 'ক্যাশ অন ডেলিভারি', icon: ShoppingBag, color: 'text-indigo-600 bg-indigo-50' },
                  { title: '৭ দিন সহজ রিটার্ন', icon: RefreshCw, color: 'text-rose-600 bg-rose-50' }
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_2px_10px_rgba(0,0,0,0.01)] min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 shrink-0 ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <p className="text-[10px] md:text-xs font-extrabold text-slate-700 leading-tight">{item.title}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Dynamic Checkout Order Form (5 Cols) */}
            <div className="lg:col-span-5 sticky top-24">
              
              <div className="bg-white rounded-3xl border border-emerald-600/30 shadow-[0_10px_35px_rgba(27,67,50,0.05)] overflow-hidden">
                
                {/* Form Top Header */}
                <div className="bg-[#1b4332] text-white p-5 text-center select-none">
                  <h3 className="font-black text-base sm:text-lg">১-ক্লিকে সরাসরি অর্ডার ফর্ম</h3>
                  <p className="text-[10px] text-emerald-200 font-bold mt-1">অর্ডার করতে নিচের ফর্মে আপনার সঠিক তথ্য দিন</p>
                </div>

                <div className="p-5 md:p-6">
                  
                  {/* Order Summary Widget */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 select-none">
                    <div className="flex items-center gap-3">
                      <img loading="lazy" src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">{product.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">ওজন: {product.weight}</p>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200 mt-3 pt-3 flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>একক মূল্য:</span>
                      <span className="text-slate-800">৳ {price}</span>
                    </div>

                    {/* Quantity Control within Summary */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-bold text-slate-500">পরিমাণ বা সংখ্যা:</span>
                      <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5">
                        <button 
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-black"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-black text-slate-850">{toBanglaNumber(quantity)}</span>
                        <button 
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-black"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Savings Notification */}
                    {hasDiscount && (
                      <div className="bg-rose-50 text-rose-600 text-[10px] font-black p-2 rounded-lg mt-3 flex items-center justify-between">
                        <span>মোট সেভিংস বা লাভ:</span>
                        <span>৳ {discountAmount * quantity}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-200 mt-3 pt-3 flex items-center justify-between text-sm">
                      <span className="font-extrabold text-slate-800">সর্বমোট বিল (৳):</span>
                      <span className="font-black text-primary text-base">৳ {toBanglaNumber(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Order Submission Form */}
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-bold text-slate-700">
                    
                    {formError && (
                      <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-600 text-[11px] font-bold mb-1.5 uppercase tracking-wide">১. আপনার নাম লিখুন *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="আপনার পুরো নাম লিখুন (যেমন: আব্দুর রহমান)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#1b4332] focus:outline-none placeholder-slate-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[11px] font-bold mb-1.5 uppercase tracking-wide">২. আপনার মোবাইল নম্বর *</label>
                      <input 
                        type="tel" 
                        required
                        maxLength={11}
                        placeholder="১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#1b4332] focus:outline-none placeholder-slate-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[11px] font-bold mb-1.5 uppercase tracking-wide">৩. আপনার সম্পূর্ণ ডেলিভারি ঠিকানা *</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="জেলা, থানা, এলাকা, বাসা নং, রোড নং বিস্তারিত ঠিকানা দিন"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#1b4332] focus:outline-none placeholder-slate-400 font-bold leading-normal"
                      ></textarea>
                    </div>

                    <div className="bg-[#e8f5e9]/50 border border-emerald-50 rounded-xl p-3 text-[10px] text-[#2e7d32] flex items-center gap-2 select-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2e7d32] animate-pulse shrink-0"></div>
                      <span><strong>ডেলিভারি চার্জ ফ্রী!</strong> ক্যাশ অন ডেলিভারিতে কোনো অগ্রিম পেমেন্ট লাগবে না।</span>
                    </div>

                    {/* Interactive Confirm Order Button with Urgency Pulse */}
                    <button 
                      type="submit"
                      className="w-full bg-[#1b4332] hover:bg-emerald-800 text-white py-4 rounded-xl text-xs sm:text-sm font-black shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group uppercase cursor-pointer"
                    >
                      <ShoppingBag size={18} className="animate-bounce" />
                      <span>অর্ডার কনফার্ম করুন (৳ {toBanglaNumber(totalPrice)})</span>
                    </button>
                    
                  </form>

                  {/* Secondary Call to Action */}
                  <div className="mt-4 border-t border-slate-100 pt-4 text-center select-none">
                    <p className="text-[10px] text-slate-400 font-bold mb-2">যেকোনো তথ্যের জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করুন</p>
                    <a 
                      href={`https://wa.me/8801969317241?text=আসসালামু%20আলাইকুম!%20আমি%20${encodeURIComponent(product.name)}%20পণ্যটি%20সম্পর্কে%20জানতে%20চাই।`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline font-extrabold"
                    >
                      <MessageCircle size={14} className="fill-current text-[#25D366]" />
                      <span>হোয়াটসঅ্যাপে আমাদের মেসেজ দিন</span>
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
