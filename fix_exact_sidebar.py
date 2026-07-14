import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

new_sidebar = """      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="font-bold text-lg text-[#2e7d32]">এম.কে.গ্রুপ</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-slate-800 hidden md:block">
          <h1 className="text-2xl font-black text-white tracking-tight">MK.GROUP</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Admin Portal</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                  activeTab === item.id 
                    ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon} 
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="mb-4">
             <div className="flex rounded-lg overflow-hidden bg-slate-800 p-1">
                <button 
                  onClick={() => setLang('bn')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'bn' ? 'bg-[#2e7d32] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                  বাংলা
                </button>
                <button 
                  onClick={() => setLang('en')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-[#2e7d32] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                  English
                </button>
             </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl text-sm font-bold transition-colors">
            <LogOut size={18} />
            {lang === 'bn' ? 'লগআউট' : 'Logout'}
          </button>
        </div>
      </div>"""

content = re.sub(r"      \{\/\* Mobile Header \*\/}.*?      <\/div>\n    <\/div>\n    \n    \{\/\* Main Content \*\/\}", new_sidebar + "\n    \n    {/* Main Content */}", content, flags=re.DOTALL)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
