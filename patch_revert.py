import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Replace menuItems
new_menu_items = """  const menuItems = [
    { id: 'dashboard', icon: '📊', label: lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard' },
    { id: 'orders', icon: '🛒', label: lang === 'bn' ? 'অর্ডার সমূহ' : 'Orders' },
    { id: 'products', icon: '📦', label: lang === 'bn' ? 'পণ্য ম্যানেজমেন্ট' : 'Products' },
    { id: 'finances', icon: '💰', label: lang === 'bn' ? 'আয় ও ব্যয়' : 'Finances' },
    { id: 'dues', icon: '📓', label: lang === 'bn' ? 'বকেয়া খাতা' : 'Dues' },
    { id: 'marketing', icon: '🚀', label: lang === 'bn' ? 'মার্কেটিং' : 'Marketing' },
    { id: 'investors', icon: '🤝', label: lang === 'bn' ? 'বিনিয়োগকারী' : 'Investors' },
    { id: 'agreement', icon: '📝', label: lang === 'bn' ? 'চুক্তিনামা' : 'Agreement' },
    { id: 'courier', icon: '🚚', label: lang === 'bn' ? 'কুরিয়ার' : 'Courier' },
  ];"""

content = re.sub(r"  const menuItems = \[.*?\];", new_menu_items, content, flags=re.DOTALL)

# Replace Mobile Header and Sidebar
new_sidebar = """      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="font-bold text-lg text-emerald-800">এম.কে.গ্রুপ</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-100 rounded-lg">
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-10 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <h1 className="text-2xl font-black text-emerald-800 tracking-tight">MK.GROUP</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Admin Portal</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors">
            লগআউট
          </button>
        </div>
      </div>"""

content = re.sub(r"      \{\/\* Mobile Header \*\/}.*?      <\/div>\n    <\/div>\n    \n    \{\/\* Main Content \*\/\}", new_sidebar + "\n    \n    {/* Main Content */}", content, flags=re.DOTALL)


with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
