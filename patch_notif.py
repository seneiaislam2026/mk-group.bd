with open("src/components/ui/TopBannerNotification.tsx", "r") as f:
    content = f.read()

target = """      {/* 2. REAL-TIME MULTI-TAB ORDER ALERTS POPUP (SLIDES IN FOR ADMINS / TESTS) */}
      {isAdminView && unreadPopups.map((notif) => (
        <div 
          key={notif.id}
          className="w-full max-w-md bg-slate-900/95 backdrop-blur-md text-white shadow-3xl rounded-2xl p-4 border border-slate-700/50 flex items-start gap-3.5 pointer-events-auto transform translate-y-0 animate-in slide-in-from-top-6 duration-300 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.5)]"
        >
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary flex-shrink-0 border border-secondary/30">
            <Bell size={20} className="animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-extrabold text-secondary flex items-center gap-1.5">
                {notif.title}
              </h5>
              <span className="text-[10px] font-medium text-slate-400">
                {new Date(notif.timestamp).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 font-medium leading-relaxed">
              {notif.message}
            </p>
            <div className="flex justify-end gap-2.5 mt-2.5">
              <button
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  // If on customer storefront, we can guide the user to order list via hash
                  if (typeof window !== 'undefined') {
                    window.location.hash = '#admin';
                  }
                }}
                className="text-[11px] font-extrabold text-secondary hover:text-secondary-light transition-colors py-1 px-1.5 cursor-pointer"
              >
                অর্ডারটি দেখুন &rarr;
              </button>
              <button
                onClick={() => markNotificationAsRead(notif.id)}
                className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors py-1 px-1.5 cursor-pointer"
              >
                পড়লাম
              </button>
            </div>
          </div>
          <button 
            onClick={() => {
              // Mark as read and dismiss from visual listing
              markNotificationAsRead(notif.id);
              dismissNotification(notif.id);
            }}
            className="w-6 h-6 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ))}"""

replacement = """      {/* 2. REAL-TIME MULTI-TAB ORDER ALERTS POPUP */}
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
      ))}"""

content = content.replace(target, replacement)
with open("src/components/ui/TopBannerNotification.tsx", "w") as f:
    f.write(content)
print("done")
