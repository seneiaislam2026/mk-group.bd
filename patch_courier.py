import re

with open('src/pages/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add translation
content = content.replace("productReceiving: 'পণ্য রিসিভিং',", "productReceiving: 'পণ্য রিসিভিং',\n      courier: 'কুরিয়ার ড্যাশবোর্ড',")
content = content.replace("productReceiving: 'Product Receiving',", "productReceiving: 'Product Receiving',\n      courier: 'Courier Dashboard',")

# 2. Add Courier Sidebar Link (desktop)
sidebar_link = """          <button 
            onClick={() => setActiveTab('courier')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'courier' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Truck size={18} /> {t.courier}
          </button>"""
content = re.sub(
    r'(<button \n\s*onClick={\(\) => setActiveTab\(\'receiving\'\)}[\s\S]*?<Download size={18} /> {t\.productReceiving}\n\s*</button>)',
    r'\1\n' + sidebar_link,
    content
)

# 3. Add Courier Sidebar Link (mobile)
sidebar_link_mobile = """              <button 
                onClick={() => { setActiveTab('courier'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'courier' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Truck size={16} /> {t.courier}
              </button>"""
content = re.sub(
    r'(<button \n\s*onClick={\(\) => { setActiveTab\(\'receiving\'\); setIsMobileMenuOpen\(false\); }}[\s\S]*?<Download size={16} /> {t\.productReceiving}\n\s*</button>)',
    r'\1\n' + sidebar_link_mobile,
    content
)

# 4. Add header title
content = content.replace("{activeTab === 'receiving' && 'পণ্য রিসিভিং (স্টক)'}", "{activeTab === 'receiving' && 'পণ্য রিসিভিং (স্টক)'}\n                  {activeTab === 'courier' && 'কুরিয়ার ড্যাশবোর্ড'}")

# 5. Add Truck icon to lucide-react imports
if "Truck" not in content and "import {" in content:
    content = re.sub(r'import\s+{([^}]*)}\s+from\s+[\'"]lucide-react[\'"]', r'import {\1, Truck } from "lucide-react"', content)

with open('src/pages/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
