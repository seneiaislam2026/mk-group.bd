import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add import
import_str = "import StaffPortal from '../components/admin/StaffPortal';\n"
content = re.sub(r'(import .* from "lucide-react";\n)', r'\1' + import_str, content)

# Add sidebar buttons
large_sidebar_btn = """          <button 
            onClick={() => setActiveTab('staff')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'staff' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <UserCheck size={18} /> স্টাফ পোর্টাল
          </button>
"""
content = content.replace("<Briefcase size={18} /> বিনিয়োগকারীগণ\n          </button>", "<Briefcase size={18} /> বিনিয়োগকারীগণ\n          </button>\n" + large_sidebar_btn)

small_sidebar_btn = """              <button 
                onClick={() => { setActiveTab('staff'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'staff' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <UserCheck size={16} /> স্টাফ পোর্টাল
              </button>
"""
content = content.replace("<Briefcase size={16} /> বিনিয়োগকারীগণ\n              </button>", "<Briefcase size={16} /> বিনিয়োগকারীগণ\n              </button>\n" + small_sidebar_btn)

# Add component rendering
content = content.replace("{/* TAB 5: SYSTEM SETTINGS */}", """          {/* TAB: STAFF PORTAL */}
          {activeTab === 'staff' && <StaffPortal />}
          
          {/* TAB 5: SYSTEM SETTINGS */}""")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
