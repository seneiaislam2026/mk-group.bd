import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

investor_btn_large = """          <button 
            onClick={() => setActiveTab('investors')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'investors' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Briefcase size={18} /> বিনিয়োগকারীগণ
          </button>
"""

content = content.replace("<FileText size={18} /> চুক্তিনামা প্রিন্ট\n          </button>", "<FileText size={18} /> চুক্তিনামা প্রিন্ট\n          </button>\n" + investor_btn_large)

investor_btn_small = """              <button 
                onClick={() => { setActiveTab('investors'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'investors' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Briefcase size={16} /> বিনিয়োগকারীগণ
              </button>
"""

content = content.replace("<FileText size={16} /> চুক্তিনামা প্রিন্ট\n              </button>", "<FileText size={16} /> চুক্তিনামা প্রিন্ট\n              </button>\n" + investor_btn_small)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
