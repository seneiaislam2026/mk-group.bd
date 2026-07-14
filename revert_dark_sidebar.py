import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Replace menuItems
new_menu_items = """  const menuItems = [
    { id: 'dashboard', icon: <BarChart3 size={18} />, label: t.dashboard },
    { id: 'products', icon: <Package size={18} />, label: t.productManagement },
    { id: 'inventory', icon: <Boxes size={18} />, label: t.inventory },
    { id: 'receiving', icon: <Download size={18} />, label: t.productReceiving },
    { id: 'courier', icon: <Truck size={18} />, label: t.courier },
    { id: 'orders', icon: <ShoppingBag size={18} />, label: t.ordersTrack, badge: 1 },
    { id: 'customers', icon: <Users size={18} />, label: t.customerList },
    { id: 'finances', icon: <Wallet size={18} />, label: t.finances },
    { id: 'dues', icon: <BookOpen size={18} />, label: t.dues },
    { id: 'agreement', icon: <FileText size={18} />, label: lang === 'bn' ? 'চুক্তিনামা প্রিন্ট' : 'Agreement Print' },
  ];"""

content = re.sub(r"  const menuItems = \[.*?\];", new_menu_items, content, flags=re.DOTALL)

# Replace Mobile Header and Sidebar
new_sidebar = """      {/* Mobile Header */}
      <div className="md:hidden bg-[#141b2d] border-b border-[#1e273c] p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="font-bold text-lg text-[#3b8941]">এম.কে.গ্রুপ</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-30 w-64 bg-[#141b2d] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out`}>
        <div className="p-5 flex items-center justify-between md:border-b-0 border-b border-[#1e273c]">
          <h1 className="text-lg font-bold text-[#3b8941] tracking-tight">{lang === 'bn' ? 'এম.কে.গ্রুপ' : 'MK.GROUP'}</h1>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#3b8941] text-white' 
                    : 'text-slate-300 hover:bg-[#1e273c] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#1e273c] mt-auto">
          <div className="mb-4">
             <p className="text-[11px] text-slate-500 mb-2">{lang === 'bn' ? 'ভাষা পরিবর্তন' : 'Language'}</p>
             <div className="flex rounded-md overflow-hidden border border-[#1e273c]">
                <button 
                  onClick={() => setLang('bn')} 
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${lang === 'bn' ? 'bg-[#3b8941] text-white' : 'bg-[#141b2d] text-slate-400 hover:bg-[#1e273c]'}`}>
                  বাংলা
                </button>
                <button 
                  onClick={() => setLang('en')} 
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${lang === 'en' ? 'bg-[#3b8941] text-white' : 'bg-[#141b2d] text-slate-400 hover:bg-[#1e273c]'}`}>
                  English
                </button>
             </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-[#1e273c] rounded-lg text-[13.5px] font-medium transition-colors">
            <LogOut size={18} />
            {lang === 'bn' ? 'লগআউট' : 'Logout'}
          </button>
        </div>
      </div>"""

content = re.sub(r"      \{\/\* Mobile Header \*\/}.*?      <\/div>\n    <\/div>\n    \n    \{\/\* Main Content \*\/\}", new_sidebar + "\n    \n    {/* Main Content */}", content, flags=re.DOTALL)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
