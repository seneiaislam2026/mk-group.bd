import React, { useState, useEffect } from 'react';
import { Download, X, Bell, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function TopBannerNotification({ isAdminView = false }: { isAdminView?: boolean }) {
  const { notifications, dismissNotification, markNotificationAsRead } = useCart();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Monitor the standard browser beforeinstallprompt event for PWA installs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Is already launched in standalone (installed) mode?
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsAppInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user manually dismissed this panel during their active session
      const isDismissed = sessionStorage.getItem('mega_pwa_banner_dismissed') === 'true';
      if (!isDismissed) {
        // Delay slightly for visual comfort after main load
        // Disable PWA banner for now
        // const timer = setTimeout(() => {
        //   setShowInstallPrompt(true);
        // }, 1500);
        // return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Track successful installations
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('Nirapod Khaddo Shomvar PWA installed successfully by user!');
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Trigger prompt
    deferredPrompt.prompt();
    
    // Wait for the customer to reply in native dialog
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User installation choice outcome: ${outcome}`);
    
    // Clear deferred prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismissPrompt = () => {
    setShowInstallPrompt(false);
    sessionStorage.setItem('mega_pwa_banner_dismissed', 'true');
  };

  // Only take unread, order-related notifications to slide down on the screen
  const unreadPopups = notifications.filter(n => !n.read).slice(0, 3);

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] pointer-events-none flex flex-col items-center p-4 gap-3">
      
      {/* 1. PROGRESSIVE WEB APP (PWA) INSTALL BANNER - SLIDES DOWN FROM TOP */}
      {showInstallPrompt && (
        <div className="w-full max-w-lg bg-black text-white shadow-2xl rounded-2xl p-4 border border-zinc-800 flex items-start gap-4 pointer-events-auto transform translate-y-0 animate-in slide-in-from-top-12 duration-500 ease-out">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
            <Download size={22} strokeWidth={2} />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="bg-zinc-800 text-zinc-300 text-[9px] font-black px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">PWA APP</span>
              <h4 className="text-sm font-extrabold text-white">এম.কে.গ্রুপ অ্যাপ ইনস্টল করুন!</h4>
            </div>
            <p className="text-xs text-zinc-450 mt-1 font-medium leading-relaxed">
              সরাসরি রিয়েল মোবাইল অ্যাপের মতো ডাউনলোড করে নিন। অফলাইনে ব্যবহার করুন, দ্রুত লোডিং হবে এবং অফার পাবেন সবার আগে!
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={handleInstallClick}
                className="bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Download size={14} strokeWidth={2.5} />
                Install
              </button>
              <button 
                onClick={handleDismissPrompt}
                className="text-zinc-400 hover:text-white text-xs font-bold transition-all px-2 py-1 cursor-pointer"
              >
                পরে করব
              </button>
            </div>
          </div>
          <button 
            onClick={handleDismissPrompt}
            className="w-8 h-8 rounded-full hover:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. REAL-TIME MULTI-TAB ORDER ALERTS POPUP */}
      {isAdminView && unreadPopups.map((notif) => (
        <div 
          key={notif.id}
          className="w-full max-w-md bg-white text-slate-800 rounded-2xl p-4 flex items-start gap-3.5 pointer-events-auto transform translate-y-0 animate-in slide-in-from-top-6 duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/60"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${notif.type === 'order' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
            {notif.type === 'order' ? <ShieldCheck size={20} /> : <Bell size={20} className="animate-pulse" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                {notif.title}
              </h5>
              <span className="text-[10px] font-bold text-slate-400">
                {new Date(notif.timestamp).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 font-bold leading-relaxed">
              {notif.message}
            </p>
            <div className="flex justify-end gap-3 mt-3">
              {notif.type === 'order' && (
                <button
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (typeof window !== 'undefined') {
                      window.location.hash = '#admin';
                    }
                  }}
                  className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  অর্ডারটি দেখুন &rarr;
                </button>
              )}
              <button
                onClick={() => markNotificationAsRead(notif.id)}
                className="text-[11px] font-black text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-50 px-2 py-1 rounded-md border border-slate-100"
              >
                পড়লাম
              </button>
            </div>
          </div>
          <button 
            onClick={() => {
              markNotificationAsRead(notif.id);
              dismissNotification(notif.id);
            }}
            className="w-7 h-7 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
