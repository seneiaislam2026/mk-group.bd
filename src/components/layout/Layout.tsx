import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import HomePage from '../../pages/HomePage';
import AdminDashboard from '../../pages/AdminDashboard';
import ProductLandingPage from '../../pages/ProductLandingPage';
import CartDrawer from '../ui/CartDrawer';
import ProductDetailsModal from '../ui/ProductDetailsModal';
import PriceListModal from '../ui/PriceListModal';
import OrderTrackingModal from '../ui/OrderTrackingModal';
import InvestorPortalModal from '../ui/InvestorPortalModal';
import TopBannerNotification from '../ui/TopBannerNotification';
import PrintInvoice from '../../pages/PrintInvoice';
import PrintAgreement from '../../pages/PrintAgreement';
import { MessageCircle } from 'lucide-react';

export default function Layout() {
  // Helper to extract product ID from hash or query parameters
  const getProductIdFromUrl = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const hash = window.location.hash;
    if (hash.startsWith('#product=')) return hash.replace('#product=', '');
    if (hash.startsWith('#product-')) return hash.replace('#product-', '');
    if (hash.startsWith('#p') && hash.length > 2 && hash !== '#pending' && hash !== '#products' && hash !== '#customers') {
      return hash.replace('#', '');
    }
    
    const searchParams = new URLSearchParams(window.location.search);
    const prodParam = searchParams.get('product') || searchParams.get('id');
    if (prodParam) return prodParam;
    
    return null;
  };

  // Simple state-based routing router for demonstration since we want 
  // both storefront and admin in one app without complex routing setup
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'landing' | 'print' | 'print-agreement'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-invoice')) return 'print';
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/print-agreement')) return 'print-agreement';
    if (typeof window === 'undefined') return 'store';
    if (getProductIdFromUrl()) return 'landing';
    return 'store';
  });

  const [landingProductId, setLandingProductId] = useState<string | null>(() => getProductIdFromUrl());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // To ensure home page opens first on fresh load (dhuklei home page ashbe, login page na)
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }

    const handleHashAndUrlChange = () => {
      const prodId = getProductIdFromUrl();
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
        setLandingProductId(null);
      } else if (window.location.pathname.startsWith('/print-agreement')) {
        setCurrentView('print-agreement');
      } else if (window.location.pathname.startsWith('/print-invoice')) {
        setCurrentView('print');
      } else if (prodId) {
        setCurrentView('landing');
        setLandingProductId(prodId);
      } else {
        setCurrentView('store');
        setLandingProductId(null);
      }
    };
    
    window.addEventListener('hashchange', handleHashAndUrlChange);
    window.addEventListener('popstate', handleHashAndUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleHashAndUrlChange);
      window.removeEventListener('popstate', handleHashAndUrlChange);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Helmet>
        <title>এম.কে.গ্রুপ | MK Group</title>
        <meta name="description" content="এম.কে.গ্রুপ - আপনার পছন্দের সকল সামগ্রী।" />
        <meta name="keywords" content="MK Group, এম.কে.গ্রুপ, এম কে গ্রুপ" />
        <link rel="canonical" href="https://www.nirapodkhaddoshomvar.com/" />
        <meta property="og:title" content="এম.কে.গ্রুপ | MK Group" />
        <meta property="og:description" content="এম.কে.গ্রুপ - আপনার পছন্দের সকল সামগ্রী।" />
        <meta property="og:url" content="https://www.nirapodkhaddoshomvar.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="এম.কে.গ্রুপ | MK Group" />
        <meta name="twitter:description" content="এম.কে.গ্রুপ - আপনার পছন্দের সকল সামগ্রী।" />
      </Helmet>
      {/* Global PWA download banner & real-time order alert pop-ups */}
      <TopBannerNotification isAdminView={currentView === 'admin'} />

      {currentView === 'print-agreement' ? (
        <>
          <Helmet>
            <title>চুক্তিনামা প্রিন্ট | এম.কে.গ্রুপ</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <PrintAgreement />
        </>
      ) : currentView === 'print' ? (
        <>
          <Helmet>
            <title>ইনভয়েস প্রিন্ট | এম.কে.গ্রুপ</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <PrintInvoice />
        </>
      ) : currentView === 'admin' ? (
        <>
          <Helmet>
            <title>অ্যাডমিন প্যানেল | এম.কে.গ্রুপ</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <AdminDashboard onLogout={() => { window.location.hash = ''; }} />
        </>
      ) : currentView === 'landing' && landingProductId ? (
        <ProductLandingPage 
          productId={landingProductId} 
          onBack={() => { window.location.hash = ''; }} 
        />
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <HomePage />
          </main>
          <Footer />
          <CartDrawer />
          <ProductDetailsModal />
          <PriceListModal />
          <OrderTrackingModal />
          <InvestorPortalModal />

          {/* Floating WhatsApp Contact Button */}
          <a 
            href="https://wa.me/8801969317241?text=আসসালামু%20আলাইকুম!%20আমি%20এম.কে.গ্রুপ%20সম্পর্কে%20জানতে%20চাই।" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.5)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
            title="হোয়াটসঅ্যাপে যোগাযোগ করুন"
          >
            <span className="max-w-0 overflow-hidden group-hover:max-w-[12rem] transition-all duration-500 ease-out font-semibold text-xs whitespace-nowrap flex leading-none">
              হোয়াটসঅ্যাপ চ্যাট &nbsp;
            </span>
            <MessageCircle size={22} className="fill-white/10" strokeWidth={2.5} />
            {/* Pulsing indicator */}
            <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-30 pointer-events-none"></span>
          </a>
        </>
      )}
    </div>
  );
}
